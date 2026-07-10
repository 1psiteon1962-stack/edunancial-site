import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { contractId } = body;

  return NextResponse.json(
   {
     status: "accepted",
     contractId,
   },
   {
     headers: {
       "Cache-Control": "no-store, max-age=0",
     },
   }
  );
}
