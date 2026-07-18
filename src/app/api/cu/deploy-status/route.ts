import { NextResponse } from "next/server";

import { assertCuPassword, getCuDeploymentStatus } from "@/lib/cu/github";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { password?: string; commitSha?: string };
    assertCuPassword(String(body.password ?? ""));

    const commitSha = String(body.commitSha ?? "").trim();
    if (!commitSha) {
      throw new Error("Commit SHA is required.");
    }

    const status = await getCuDeploymentStatus(commitSha);
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to check CU deployment status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
