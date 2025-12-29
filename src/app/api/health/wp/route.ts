import { NextResponse } from "next/server";

function safeHost(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export const runtime = "nodejs";

export async function GET() {
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
      headers: { "Content-Type": "application/json" },
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
        hasGraphQlErrors: Boolean(json?.errors?.length),
        graphQlErrors: json?.errors?.slice?.(0, 3) ?? undefined,
        postCountSample: Array.isArray(posts) ? posts.length : 0,
        postsSample: Array.isArray(posts) ? posts : undefined,
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


