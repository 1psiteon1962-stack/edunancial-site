/**
 * Academy consistency validator.
 *
 * Prevents files from being saved or approved when the filename or curriculum
 * front-matter track contradicts the assigned academy (pillar).
 *
 * Example blocked case:
 *   filename: "blue-level-1-combined.md"  +  assignment pillar: "white"
 *   => Error: filename implies BLUE but file is assigned to white academy
 *
 * This check is enforced in:
 *   - updateBatchFile()  (assignment save)
 *   - bulkReview()       (approval gate)
 */

import type { EdunancialPillar } from "@/lib/admin-content/types";

/** Map pillar identifiers to their canonical uppercase track name. */
const PILLAR_TO_TRACK: Record<string, string> = {
  red: "RED",
  white: "WHITE",
  blue: "BLUE",
};

/** Ordered so longer / more-specific tokens are checked first. */
const COLOR_TOKENS: ReadonlyArray<{ token: string; pillar: string }> = [
  { token: "blue", pillar: "blue" },
  { token: "white", pillar: "white" },
  { token: "red", pillar: "red" },
];

/**
 * Determine which academy a filename implies, if any.
 * Matches whole-word tokens (surrounded by separators or string boundaries)
 * so that, e.g., "already-covered.md" does not falsely imply "red".
 */
export function academyImpliedByFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  for (const { token, pillar } of COLOR_TOKENS) {
    // Match the token at word boundaries (separators: -, _, ., space, or
    // start/end of the basename without extension).
    const pattern = new RegExp(`(^|[-_.\\s])${token}([-_.\\s]|$)`);
    if (pattern.test(lower)) return pillar;
  }
  return null;
}

/**
 * Extract the curriculum track declared in front-matter, if present.
 * Returns the lowercase pillar string ("red" | "white" | "blue") or null.
 *
 * Reads the `track:` field from YAML front-matter without a full parse so
 * that this helper remains synchronous and dependency-free.
 */
export function academyImpliedByFrontMatter(rawText: string | null | undefined): string | null {
  if (!rawText) return null;
  // Front-matter block is between the first two `---` lines.
  const fm = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const trackLine = fm[1].split(/\r?\n/).find((line) => /^track\s*:/i.test(line));
  if (!trackLine) return null;
  const value = trackLine.replace(/^track\s*:\s*/i, "").trim().toUpperCase();
  if (value === "RED") return "red";
  if (value === "WHITE") return "white";
  if (value === "BLUE") return "blue";
  return null;
}

export type ConsistencyResult =
  | { consistent: true }
  | { consistent: false; error: string };

/**
 * Validate that a file's filename and/or curriculum front-matter track are
 * consistent with the academy (pillar) it has been assigned to.
 *
 * @param filename  - The original (or normalized) filename being evaluated.
 * @param pillar    - The EdunancialPillar assigned to the file.
 * @param rawText   - Optional raw markdown text for front-matter inspection.
 */
export function validateAcademyConsistency(
  filename: string,
  pillar: EdunancialPillar,
  rawText?: string | null,
): ConsistencyResult {
  // Only the three color academies have a strict track; skip for others.
  const assignedTrack = PILLAR_TO_TRACK[pillar];
  if (!assignedTrack) return { consistent: true };

  // 1. Filename-based check.
  const filenameImplied = academyImpliedByFilename(filename);
  if (filenameImplied && filenameImplied !== pillar) {
    return {
      consistent: false,
      error:
        `Academy mismatch: filename "${filename}" implies ${PILLAR_TO_TRACK[filenameImplied]} academy ` +
        `but the file is assigned to ${assignedTrack} academy. ` +
        `Correct the academy assignment or rename the file before saving.`,
    };
  }

  // 2. Front-matter track check (when markdown text is available).
  const fmImplied = academyImpliedByFrontMatter(rawText);
  if (fmImplied && fmImplied !== pillar) {
    return {
      consistent: false,
      error:
        `Academy mismatch: curriculum front-matter declares track ${PILLAR_TO_TRACK[fmImplied]} ` +
        `but the file is assigned to ${assignedTrack} academy. ` +
        `Correct the academy assignment or update the front-matter before saving.`,
    };
  }

  return { consistent: true };
}
