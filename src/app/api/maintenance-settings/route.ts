import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/wp";

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      maintenanceActive: settings.maintenanceActive,
      maintenancePassword: settings.maintenancePassword,
    });
  } catch {
    // Return 503 so middleware knows this is
    // an error, not a real "off" state
    return NextResponse.json(
      { error: "unavailable" },
      { status: 503 }
    );
  }
}
