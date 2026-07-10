import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const body = await request.json();

  return NextResponse.json(
    {
      success: true,
      checkoutUrl: "/checkout?product=" + body.id,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );

}
