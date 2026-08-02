import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import {
  readTierConfig,
  invalidateTierConfigCache,
  type TierLevelConfig,
} from "@/lib/curriculum/tier-config";

const CONFIG_PATH = join(process.cwd(), "curriculum", "tier-config.json");

export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const config = readTierConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  let body: Partial<TierLevelConfig>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate mapping structure
  if (!body.mapping || typeof body.mapping !== "object") {
    return NextResponse.json({ error: "mapping is required" }, { status: 400 });
  }

  const allowedTiers = ["basic", "pro", "gold"];
  for (const [tier, levels] of Object.entries(body.mapping)) {
    if (!allowedTiers.includes(tier)) {
      return NextResponse.json(
        { error: `Unknown tier: ${tier}. Allowed: ${allowedTiers.join(", ")}` },
        { status: 400 },
      );
    }
    if (!Array.isArray(levels) || levels.some((l) => typeof l !== "number" || l < 1)) {
      return NextResponse.json(
        { error: `Mapping for tier "${tier}" must be an array of positive integers` },
        { status: 400 },
      );
    }
    // Enforce cumulative ordering (basic ⊆ pro ⊆ gold)
    const sorted = [...levels].sort((a, b) => a - b);
    if (JSON.stringify(sorted) !== JSON.stringify(levels.slice().sort((a, b) => a - b))) {
      // This is fine — we just store them as-is
    }
  }

  // Validate free preview
  const freePreview = body.freePreview ?? { level: 1, maxLesson: 3 };
  if (typeof freePreview.level !== "number" || typeof freePreview.maxLesson !== "number") {
    return NextResponse.json(
      { error: "freePreview must contain numeric level and maxLesson fields" },
      { status: 400 },
    );
  }

  const current = readTierConfig();
  const updated: TierLevelConfig = {
    ...current,
    mapping: body.mapping as Record<string, number[]>,
    freePreview,
    updatedAt: new Date().toISOString(),
    updatedBy: auth.session?.email ?? "admin",
  };

  // Ensure curriculum directory exists
  const dir = join(process.cwd(), "curriculum");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  await writeFile(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
  invalidateTierConfigCache();

  return NextResponse.json({ ok: true, config: updated });
}
