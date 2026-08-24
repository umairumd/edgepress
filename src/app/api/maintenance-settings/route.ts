import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/wp";

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { maintenanceActive: false, maintenancePassword: "" },
      { status: 200 }
    );
  }
}
