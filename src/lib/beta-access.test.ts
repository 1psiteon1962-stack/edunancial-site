import test from "node:test";
import assert from "node:assert/strict";

import {
  applyBetaLogin,
  createBetaInvitation,
  recordBetaFeedback,
  renderBetaInvitationEmail,
} from "./beta-access";

test("beta activation starts on first successful login for the approved email", async () => {
  const createdAt = "2026-07-12T00:00:00.000Z";
  const firstLoginAt = "2026-07-12T12:00:00.000Z";
  const { invitation, passNumber } = await createBetaInvitation({
    testerName: "Taylor Beta",
    approvedEmail: "beta@example.com",
    existingInvitations: [],
    now: createdAt,
  });

  const result = await applyBetaLogin({
    invitation,
    email: "beta@example.com",
    passNumber,
    now: firstLoginAt,
  });

  assert.equal(result.error, undefined);
  assert.equal(result.invitation?.status, "active");
  assert.equal(result.invitation?.redeemedAt, firstLoginAt);
  assert.equal(result.invitation?.firstLoginAt, firstLoginAt);
  assert.equal(result.invitation?.betaStartsAt, firstLoginAt);
  // Approved product policy: 90 days from first successful activation.
  assert.equal(result.invitation?.betaExpiresAt, "2026-10-10T12:00:00.000Z");
  assert.equal(result.access.remainingMs, 90 * 24 * 60 * 60 * 1000);
});

test("beta invitations reject the wrong email and expire exactly 90 days after activation", async () => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const activatedAt = "2026-07-12T02:00:00.000Z";
  const expiresAt = "2026-10-10T02:00:00.000Z";
  const at = (offsetMs: number) => new Date(new Date(activatedAt).getTime() + offsetMs).toISOString();
  const { invitation, passNumber } = await createBetaInvitation({
    testerName: "Taylor Beta",
    approvedEmail: "beta@example.com",
    existingInvitations: [],
    now: "2026-07-12T00:00:00.000Z",
  });

  // Email binding: the pass is useless with any other email address.
  const mismatch = await applyBetaLogin({
    invitation,
    email: "wrong@example.com",
    passNumber,
    now: "2026-07-12T01:00:00.000Z",
  });
  assert.match(mismatch.error ?? "", /different approved email/i);
  assert.equal(mismatch.invitation?.status, "approved");
  assert.equal(mismatch.invitation?.betaStartsAt, null, "a rejected attempt must not start the clock");

  // Access begins on successful activation, not at issuance.
  const activated = await applyBetaLogin({
    invitation,
    email: "beta@example.com",
    passNumber,
    now: activatedAt,
  });
  assert.equal(activated.error, undefined);
  assert.equal(activated.invitation?.status, "active");
  assert.equal(activated.invitation?.betaStartsAt, activatedAt);
  assert.equal(activated.invitation?.betaExpiresAt, expiresAt);

  const check = (now: string) => applyBetaLogin({ invitation: activated.invitation, email: "beta@example.com", now });

  // The old 72-hour window no longer applies.
  const after72h = await check(at(72 * 60 * 60 * 1000 + 1));
  assert.equal(after72h.invitation?.status, "active");
  assert.ok(after72h.access.remainingMs > 0);

  // Still active one millisecond before day 90.
  const justBefore = await check(at(90 * DAY_MS - 1));
  assert.equal(justBefore.invitation?.status, "active");
  assert.equal(justBefore.access.remainingMs, 1);

  // Expires precisely at the 90-day boundary, with zero time remaining.
  const atBoundary = await check(expiresAt);
  assert.equal(atBoundary.invitation?.status, "expired");
  assert.equal(atBoundary.access.remainingMs, 0);

  const later = await check(at(90 * DAY_MS + 1));
  assert.equal(later.invitation?.status, "expired");
  assert.equal(later.access.remainingMs, 0);
});

test("beta feedback records tester identity without extra sensitive data", async () => {
  const { invitation } = await createBetaInvitation({
    testerName: "Taylor Beta",
    approvedEmail: "beta@example.com",
    existingInvitations: [],
    now: "2026-07-12T00:00:00.000Z",
  });

  const { invitation: updatedInvitation, submission } = recordBetaFeedback(
    invitation,
    {
      id: "feedback-1",
      testerId: "tester-1",
      email: "beta@example.com",
      rating: 5,
      countryRegion: "Ontario, Canada",
      strongestFeature: "The dashboard made the pathway clear.",
      improvementRequest: "Show more beta onboarding context.",
      confusingMoment: "I needed more detail on the first login timer.",
      practicalOutcome: "It helped me prioritize my next money decision.",
    },
    "2026-07-12T04:00:00.000Z",
  );

  assert.equal(updatedInvitation.feedbackSubmittedAt, "2026-07-12T04:00:00.000Z");
  assert.equal(submission.email, "beta@example.com");
  assert.equal(submission.testerId, "tester-1");
  assert.equal(submission.rating, 5);
});

test("beta invitation email can render in Spanish", () => {
  const email = renderBetaInvitationEmail({
    testerName: "María",
    approvedEmail: "maria@example.com",
    passNumber: "PASS-123",
    languageCode: "es-MX",
  });

  assert.equal(email.subject, "Su invitación para probar Edunancial");
  assert.match(email.text, /Hola María/);
  assert.match(email.text, /Número de pase único/);
});
