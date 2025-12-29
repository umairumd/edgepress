import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/siteUrl";

export async function GET() {
  // Safety: don't expose env details in production.
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    SITE_URL: process.env.SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    RESOLVED_SITE_URL: getSiteUrl(),
    WP_GRAPHQL_ENDPOINT: process.env.WP_GRAPHQL_ENDPOINT,
    WP_MEDIA_DOMAIN: process.env.WP_MEDIA_DOMAIN,
  });
}


