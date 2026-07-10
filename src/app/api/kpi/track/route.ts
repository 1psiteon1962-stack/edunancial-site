import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (process.env.NODE_ENV !== "production") {
      console.log("KPI event received:", {
        ...body,
        receivedAt: new Date().toISOString(),
      });
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.warn("KPI tracking route failed:", error);

    return NextResponse.json(
      { success: false, error: "KPI tracking failed" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
