import { NextRequest, NextResponse } from "next/server";

const REDIRECT_API_URL = process.env.WP_REDIRECTS_API_URL || "";
const CACHE_TTL_MS = 300_000;

const MAINTENANCE_COOKIE = "inoma_bypass";
const MAINTENANCE_CACHE_MS = 60_000; // 1 min
let _maintenanceSettings: {
  active: boolean;
  password: string;
} | null = null;
let _maintenanceLastFetch = 0;

let redirectCache: Record<string, { target: string; type: number }> | null = null;
let lastFetch = 0;

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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://inomadigital.com"}/api/maintenance-settings`,
      { cache: "no-store", signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      _maintenanceSettings = {
        active: Boolean(data.maintenanceActive),
        password: String(data.maintenancePassword ?? ""),
      };
      _maintenanceLastFetch = now;
      return _maintenanceSettings;
    }
  } catch {
    // On failure keep last known state or default off
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
