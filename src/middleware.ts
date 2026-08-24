import { NextRequest, NextResponse } from "next/server";

const REDIRECT_API_URL = process.env.WP_REDIRECTS_API_URL || "";
const CACHE_TTL_MS = 300_000;

const MAINTENANCE_COOKIE = "inoma_bypass";
const WP_ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT ?? "";
const MAINTENANCE_QUERY = JSON.stringify({
  query: `{
    page(id: "maintenance-settings", idType: URI) {
      siteSettings {
        maintenanceActive
        maintenancePassword
      }
    }
  }`,
});

let _maintenanceSettings: {
  active: boolean;
  password: string;
} | null = null;
let _maintenanceLastFetch = 0;
const MAINTENANCE_CACHE_MS = 10_000;

let redirectCache: Record<string, { target: string; type: number }> | null = null;
let lastFetch = 0;

type MaintenanceGqlResponse = {
  data?: {
    page?: {
      siteSettings?: {
        maintenanceActive?: boolean;
        maintenancePassword?: string;
      } | null;
    } | null;
  } | null;
};

async function getMaintenanceStatus(): Promise<{
  active: boolean;
  password: string;
}> {
  const now = Date.now();
  if (
    _maintenanceSettings !== null &&
    now - _maintenanceLastFetch < MAINTENANCE_CACHE_MS
  ) {
    return _maintenanceSettings;
  }

  if (!WP_ENDPOINT) {
    return _maintenanceSettings ?? { active: false, password: "" };
  }

  try {
    const res = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: MAINTENANCE_QUERY,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = (await res.json()) as MaintenanceGqlResponse;
      const s = json?.data?.page?.siteSettings;

      // Only update cache on valid response
      if (s !== undefined) {
        _maintenanceSettings = {
          active: Boolean(s?.maintenanceActive),
          password: String(s?.maintenancePassword ?? ""),
        };
        _maintenanceLastFetch = now;
      }
    }
  } catch {
    // On failure: keep last known state
    // Do not update _maintenanceLastFetch so
    // next request retries immediately
  }

  return _maintenanceSettings ?? { active: false, password: "" };
}

async function getRedirectMap(): Promise<Record<string, { target: string; type: number }> | null> {
  if (!REDIRECT_API_URL) return null;
  const now = Date.now();
  if (redirectCache !== null && now - lastFetch < CACHE_TTL_MS) {
    return redirectCache;
  }
  try {
    const res = await fetch(REDIRECT_API_URL, { cache: "no-store" });
    if (!res.ok) return redirectCache;
    const data = await res.json();
    if (data && typeof data === "object") {
      redirectCache = data as Record<string, { target: string; type: number }>;
      lastFetch = now;
    }
  } catch {
    // Skip redirect on fetch failure; continue request
  }
  return redirectCache;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip maintenance check for these paths
  const isExempt =
    pathname === "/maintenance" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  if (!isExempt) {
    const { active, password } = await getMaintenanceStatus();

    if (active) {
      const bypassCookie = request.cookies.get(MAINTENANCE_COOKIE);
      const hasValidBypass = password && bypassCookie?.value === password;

      if (!hasValidBypass) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  }

  // 1. Host normalization (if present) — none in this middleware; add above trailing-slash if needed.

  // 2. WordPress redirect lookup (skipped when WP_REDIRECTS_API_URL is unset)
  if (REDIRECT_API_URL) {
    const path = pathname.replace(/^\/|\/$/g, "");
    if (path !== "") {
      const map = await getRedirectMap();
      if (map) {
        const redirect = map[path];
        if (redirect?.target) {
          const targetUrl = redirect.target.startsWith("http")
            ? redirect.target
            : new URL(redirect.target, request.url).toString();
          return NextResponse.redirect(targetUrl, (redirect.type as 301 | 302 | 307 | 308) || 307);
        }
      }
    }
  }

  // 3. Trailing slash normalization (308, except root)
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  // 4. Continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|\\..*).*)"],
};
