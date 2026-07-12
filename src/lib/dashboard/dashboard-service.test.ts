import test from "node:test";
import assert from "node:assert/strict";

import { getDashboardData, getSubscriptionLevel } from "./dashboard-service";

const baseUser = {
  id: "member-123",
  email: "member@example.com",
  firstName: "Taylor",
  lastName: "Morgan",
  membershipTier: "premium",
  joinedDate: "2026-01-15T00:00:00.000Z",
  country: "United States",
  assessmentCompleted: true,
  overallScore: 82,
  betaAccess: null,
} as const;

test("maps authentication tiers to dashboard subscription levels", () => {
  assert.equal(getSubscriptionLevel("free"), "Member Access");
  assert.equal(getSubscriptionLevel("basic"), "Individual Membership");
  assert.equal(getSubscriptionLevel("premium"), "Approved Organization Membership");
  assert.equal(getSubscriptionLevel("enterprise"), "100+ Member Organization Rate");
  assert.equal(getSubscriptionLevel("beta"), "Beta Tester");
});

test("builds dashboard data for the three North American learning paths", () => {
  const data = getDashboardData(baseUser);

  assert.equal(data.subscriptionLevel, "Approved Organization Membership");
  assert.equal(data.learningPaths.length, 3);
  assert.deepEqual(
    data.learningPaths.map((path) => path.code),
    ["RED", "WHITE", "BLUE"],
  );
  assert.equal(data.continueLearning.trackCode, "WHITE");
  assert.match(data.continueLearning.lessonTitle, /\S/);
  assert.equal(data.passport.rank, "Professional");
  assert.equal(data.passport.nextRank, "Expert");
  assert.ok(data.earnedCertificates.length >= 3);
  assert.equal(data.announcements.length, 3);
});

test("exposes books, pdfs, worksheets, and audio downloads on the dashboard", () => {
  const data = getDashboardData({
    ...baseUser,
    membershipTier: "enterprise",
  });

  assert.deepEqual(
    [...new Set(data.downloads.map((download) => download.category))].sort(),
    ["Audio", "Books", "PDFs", "Worksheets"],
  );
  assert.ok(data.downloads.every((download) => download.href.startsWith("/library/")));
});
