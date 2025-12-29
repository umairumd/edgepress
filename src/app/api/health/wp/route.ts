import { NextResponse, type NextRequest } from "next/server";

function safeHost(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export const runtime = "nodejs";

function isAuthorized(req: NextRequest) {
  const token = (process.env.HEALTHCHECK_TOKEN || "").trim();
  if (!token) return false;
  const provided = req.nextUrl.searchParams.get("token") || "";
  return provided === token;
}

export async function GET(req: NextRequest) {
  // Don't expose health details publicly unless explicitly authorized.
  if (!isAuthorized(req)) return new NextResponse("Not Found", { status: 404 });

  const endpoint = (process.env.WP_GRAPHQL_ENDPOINT || "").trim();
  const host = safeHost(endpoint);

  if (!endpoint) {
    return NextResponse.json(
      {
        ok: false,
        reason: "missing_env",
        env: { hasWpGraphqlEndpoint: false, hasWpMediaDomain: Boolean(process.env.WP_MEDIA_DOMAIN) },
      },
      { status: 500 }
    );
  }

  const query = `
    query HealthCheck {
      posts(first: 5, where: {orderby: {field: DATE, order: DESC}}) {
        nodes { slug title date }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      // Some security layers (e.g., Cloudflare Bot Fight Mode) can be stricter for
      // non-browser user agents. This is a harmless header for WordPress/WPGraphQL.
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; InomaDigital/1.0; +https://inomadigital.com)",
      },
      body: JSON.stringify({ query }),
      // Don't cache health checks
      cache: "no-store",
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }

    const posts = json?.data?.posts?.nodes;

    return NextResponse.json(
      {
        ok: res.ok && !json?.errors,
        wpHost: host,
        httpStatus: res.status,
        responseHeaders: {
          server: res.headers.get("server"),
          "content-type": res.headers.get("content-type"),
          location: res.headers.get("location"),
          "cf-ray": res.headers.get("cf-ray"),
          "cf-cache-status": res.headers.get("cf-cache-status"),
        },
        hasGraphQlErrors: Boolean(json?.errors?.length),
        graphQlErrors: json?.errors?.slice?.(0, 3) ?? undefined,
        postCountSample: Array.isArray(posts) ? posts.length : 0,
        postsSample: Array.isArray(posts) ? posts : undefined,
        bodyPreview: !res.ok ? text.slice(0, 800) : undefined,
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        wpHost: host,
        reason: "fetch_failed",
        error: e?.message || String(e),
      },
      { status: 502 }
    );
  }
}


