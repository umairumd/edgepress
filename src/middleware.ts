import { NextRequest, NextResponse } from "next/server";

const REDIRECT_API_URL = "https://cms.inomadigital.com/wp-json/inomadigital/v1/redirects";
const CACHE_TTL_MS = 300_000;

let redirectCache: Record<string, { target: string; type: number }> | null = null;
let lastFetch = 0;

async function getRedirectMap(): Promise<Record<string, { target: string; type: number }> | null> {
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

  // 1. Host normalization (if present) — none in this middleware; add above trailing-slash if needed.

  // 2. WordPress redirect lookup
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
