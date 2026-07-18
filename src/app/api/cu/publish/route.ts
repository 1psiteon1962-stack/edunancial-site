import { NextResponse } from "next/server";

import { assertCuPassword, publishCuContent } from "@/lib/cu/github";
import { validateCuDraftInput, validateSelectedCuDestination, type CuDraftInput } from "@/lib/cu/workbench";

function sanitizeInput(body: Partial<CuDraftInput>): CuDraftInput {
  return {
    password: String(body.password ?? ""),
    track: body.track as CuDraftInput["track"],
    category: body.category as CuDraftInput["category"],
    level: Number(body.level) as CuDraftInput["level"],
    language: String(body.language ?? "en-US"),
    destination: String(body.destination ?? ""),
    mode: body.mode as CuDraftInput["mode"],
    content: String(body.content ?? ""),
  };
}

export async function POST(request: Request) {
  try {
    const input = validateCuDraftInput(sanitizeInput(await request.json()));
    assertCuPassword(input.password);
    input.destination = validateSelectedCuDestination(input);
    const result = await publishCuContent(input);
    return NextResponse.json({
      ...result,
      messages: [
        "✓ File updated",
        "✓ Git commit completed",
        "✓ Netlify deployment started",
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to publish CU update.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
