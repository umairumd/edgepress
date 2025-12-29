import { NextResponse } from "next/server";

export async function GET() {
  // Dev-only: don't expose origin details in production.
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const endpoint = (process.env.WP_GRAPHQL_ENDPOINT || "").trim();
  if (!endpoint) {
    return NextResponse.json({ ok: false, error: "Missing WP_GRAPHQL_ENDPOINT" }, { status: 500 });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ generalSettings { title } }" }),
      cache: "no-store",
    });

    const text = await res.text();
    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        endpoint,
        bodyPreview: text.slice(0, 800),
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, endpoint, error: e?.message || String(e) },
      { status: 502 }
    );
  }
}


