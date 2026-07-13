import test from "node:test";
import assert from "node:assert/strict";

import {
  applyBetaLogin,
  createBetaInvitation,
  recordBetaFeedback,
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
  assert.equal(result.invitation?.betaExpiresAt, "2026-07-15T12:00:00.000Z");
});

test("beta invitations reject the wrong email and expire after 72 hours", async () => {
  const { invitation, passNumber } = await createBetaInvitation({
    testerName: "Taylor Beta",
    approvedEmail: "beta@example.com",
    existingInvitations: [],
    now: "2026-07-12T00:00:00.000Z",
  });

  const mismatch = await applyBetaLogin({
    invitation,
    email: "wrong@example.com",
    passNumber,
    now: "2026-07-12T01:00:00.000Z",
  });
  assert.match(mismatch.error ?? "", /different approved email/i);

  const activated = await applyBetaLogin({
    invitation,
    email: "beta@example.com",
    passNumber,
    now: "2026-07-12T02:00:00.000Z",
  });

  const expired = await applyBetaLogin({
    invitation: activated.invitation,
    email: "beta@example.com",
    now: "2026-07-15T02:00:00.001Z",
  });

  assert.equal(expired.invitation?.status, "expired");
  assert.equal(expired.access.remainingMs, 0);
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
