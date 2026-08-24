import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/wp";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const settings = await getSiteSettings();

    if (
      !settings.maintenancePassword ||
      password !== settings.maintenancePassword
    ) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("inoma_bypass", settings.maintenancePassword, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
