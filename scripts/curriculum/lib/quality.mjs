// Shared build-time quality classification for curriculum inventory.
// This does not mutate authored curriculum. It makes "file exists" distinct
// from "learner-ready content exists".

export const QUALITY_STATUSES = Object.freeze([
  "canonical",
  "machine-validated",
  "reviewed",
  "stale",
  "template",
  "placeholder",
  "missing",
]);

const PLACEHOLDER_PATTERNS = [
  /^Localized curriculum content for\b/iu,
  /\bplaceholder\b/iu,
  /\btranslation coming\b/iu,
  /\bTODO\b/u,
];

export function classifyTranslationQuality({ body, canonicalBody = "", explicitStatus = "" }) {
  const text = String(body ?? "").trim();
  const canonical = String(canonicalBody ?? "").trim();
  const status = String(explicitStatus ?? "").trim().toLowerCase();

  if (!text) return "missing";
  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text))) return "placeholder";
  if (status === "reviewed") return "reviewed";
  if (status === "stale") return "stale";

  // A translation that is dramatically shorter than a substantial canonical
  // lesson is a template/summary, not a complete translated lesson.
  if (canonical.length >= 2000 && text.length < 1500 && text.length < canonical.length * 0.5) {
    return "template";
  }

  return "machine-validated";
}

export function isLearnerReadyStatus(status) {
  return status === "canonical" || status === "reviewed" || status === "machine-validated";
}
