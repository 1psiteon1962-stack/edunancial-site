import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("KPI event received:", {
      ...body,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn("KPI tracking route failed:", error);

    return NextResponse.json(
      { success: false, error: "KPI tracking failed" },
      { status: 500 }
    );
  }
}
