import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": 
    "https://cms.inomadigital.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams
    .get("secret");

  if (!secret || 
      secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json(
    {
      revalidated: true,
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}
