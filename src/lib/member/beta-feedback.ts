import { getStore } from "@netlify/blobs";

/**
 * Beta tester feedback, stored server-side (Netlify Blobs) so the owner actually
 * receives it. Previously the form wrote only to the tester's own browser storage.
 */
export const BETA_FEEDBACK_STORE = "edunancial-beta-feedback";

export type BetaFeedbackRecord = {
  id: string;
  submittedAt: string;
  userId: string;
  email: string | null;
  rating: number;
  countryRegion: string | null;
  strongestFeature: string;
  improvementRequest: string;
  confusingMoment: string;
  practicalOutcome: string;
  additionalNotes: string | null;
};

const LIMIT = 4000;
function text(value: unknown, required: boolean): string | null {
  if (typeof value !== "string") return required ? null : "";
  const trimmed = value.trim().slice(0, LIMIT);
  return required && !trimmed ? null : trimmed;
}

/** Pure validation; returns the normalized fields or an error message. */
export function validateBetaFeedback(body: Record<string, unknown>):
  | { ok: true; fields: Omit<BetaFeedbackRecord, "id" | "submittedAt" | "userId" | "email"> }
  | { ok: false; error: string } {
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "Rating must be 1 to 5." };
  const strongestFeature = text(body.strongestFeature, true);
  const improvementRequest = text(body.improvementRequest, true);
  const confusingMoment = text(body.confusingMoment, true);
  const practicalOutcome = text(body.practicalOutcome, true);
  if (strongestFeature === null || improvementRequest === null || confusingMoment === null || practicalOutcome === null) {
    return { ok: false, error: "Please answer all required questions." };
  }
  const countryRegion = text(body.countryRegion, false);
  const additionalNotes = text(body.additionalNotes, false);
  return {
    ok: true,
    fields: {
      rating,
      countryRegion: countryRegion ? countryRegion.slice(0, 120) : null,
      strongestFeature,
      improvementRequest,
      confusingMoment,
      practicalOutcome,
      additionalNotes: additionalNotes || null,
    },
  };
}

function store() {
  return getStore({ name: BETA_FEEDBACK_STORE, consistency: "strong" });
}

export async function saveBetaFeedback(record: BetaFeedbackRecord): Promise<void> {
  await store().setJSON(`feedback/${record.submittedAt.slice(0, 7)}/${record.id}.json`, record);
}

export async function listBetaFeedback(limit = 200): Promise<BetaFeedbackRecord[]> {
  const { blobs } = await store().list({ prefix: "feedback/" });
  const keys = blobs.map((blob) => blob.key).sort().reverse().slice(0, limit);
  const rows = await Promise.all(keys.map((key) => store().get(key, { type: "json" }).catch(() => null)));
  return (rows.filter(Boolean) as BetaFeedbackRecord[]).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
