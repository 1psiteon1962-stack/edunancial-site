import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { getPublishedTrack } from "@/lib/curriculum/authoritative-published";

const TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"] as const;
const RECOVERED_LEVEL_2 = ["RED", "WHITE", "PURPLE"] as const;

/**
 * Recovery non-regression gate.
 *
 * Do not lower these expectations to make a build pass. The production site
 * already exposes this curriculum, so future recovery/upload work must add to
 * this baseline rather than replace it.
 */
test("all eight tracks retain the complete Level 1 baseline", async () => {
  const previous = process.env.NODE_ENV;
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";
  try {
    for (const code of TRACKS) {
      const track = await getPublishedTrack(code, "en-US");
      const level = track?.levels.find((entry) => entry.level === 1);
      assert.equal(level?.lessonCount, 50, `${code} Level 1 must retain all 50 lessons`);
      assert.equal(level?.lessons[0]?.id, `${code}-L1-001`);
      assert.equal(level?.lessons[49]?.id, `${code}-L1-050`);
    }
  } finally {
    (process.env as Record<string, string | undefined>).NODE_ENV = previous;
  }
});

test("verified recovered Level 2 bundles retain all 50 lessons", async () => {
  for (const code of RECOVERED_LEVEL_2) {
    const track = await getPublishedTrack(code, "en-US");
    const level = track?.levels.find((entry) => entry.level === 2);
    assert.equal(level?.lessonCount, 50, `${code} Level 2 must retain all 50 recovered lessons`);
    assert.equal(level?.lessons[0]?.id, `${code}-L2-001`);
    assert.equal(level?.lessons[49]?.id, `${code}-L2-050`);
  }
});

test("all eight committed Level 3 sets remain discoverable", async () => {
  for (const code of TRACKS) {
    const track = await getPublishedTrack(code, "en-US");
    const level = track?.levels.find((entry) => entry.level === 3);
    assert.equal(level?.lessonCount, 50, `${code} Level 3 must retain all 50 committed lessons`);
    assert.equal(level?.lessons[0]?.id, `${code}-L3-001`);
    assert.equal(level?.lessons[49]?.id, `${code}-L3-050`);
  }
});

test("curriculum resolution remains locale-driven rather than language-hardwired", async () => {
  const english = await getPublishedTrack("RED", "en-US");
  const spanish = await getPublishedTrack("RED", "es-ES");
  const frenchCanada = await getPublishedTrack("RED", "fr-CA");
  assert.ok(english && spanish && frenchCanada);
  assert.equal(spanish.code, english.code);
  assert.equal(frenchCanada.code, english.code);
  assert.equal(spanish.levels.find((entry) => entry.level === 1)?.lessonCount, 50);
  assert.equal(frenchCanada.levels.find((entry) => entry.level === 1)?.lessonCount, 50);
});


const PROTECTED_L1_TRACKS = ["RED", "WHITE", "BLUE", "GOLD"] as const;
const PROTECTED_L1_LOCALES = ["es-ES", "es-Caribbean", "fr-FR", "fr-CA", "it", "de", "nl", "pt-PT", "pt-BR"] as const;

function hasProtectedL1Source(track: string, lessonNumber: number, locale: string): boolean {
  const id = `${track}-L1-${String(lessonNumber).padStart(3, "0")}`;
  const canonical = join(process.cwd(), "content", "curriculum", track, "L1", `${id}.${locale}.md`);
  if (existsSync(canonical)) return true;

  const legacyRoot = join(process.cwd(), "content", "courses", track.toLowerCase(), "level-1");
  if (existsSync(legacyRoot)) {
    const needle = id.toLowerCase();
    const localeTokens = [locale, locale.toLowerCase(), locale.replaceAll("-", "_").toLowerCase()];
    const stack = [legacyRoot];
    while (stack.length) {
      const dir = stack.pop();
      if (!dir) break;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else {
          const lower = full.toLowerCase().replaceAll("_", "-");
          if (lower.includes(needle) && localeTokens.some((token) => lower.includes(token.toLowerCase().replaceAll("_", "-")))) return true;
        }
      }
    }
  }

  // Compressed recovery bundles are validated as exactly 50 lessons by the
  // prebuild installer. Their presence protects completed work that has not
  // yet been materialized as canonical sidecars.
  const bundleRoot = join(process.cwd(), "curriculum", "translation-bundles", "l1");
  if (!existsSync(bundleRoot)) return false;
  const prefix = `${track.toLowerCase()}-l1-${locale}`.toLowerCase();
  return readdirSync(bundleRoot).some((name) => name.toLowerCase().startsWith(prefix));
}

test("RED WHITE BLUE and GOLD retain every completed Level 1 locale source", () => {
  for (const track of PROTECTED_L1_TRACKS) {
    for (const locale of PROTECTED_L1_LOCALES) {
      for (let lessonNumber = 1; lessonNumber <= 50; lessonNumber += 1) {
        assert.ok(
          hasProtectedL1Source(track, lessonNumber, locale),
          `${track} L1 ${locale} lesson ${lessonNumber} recovery source must never disappear`,
        );
      }
    }
  }
});
