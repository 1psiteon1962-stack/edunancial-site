import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    alive: true,
    heartbeatAt: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
}
