import assert from "node:assert/strict";
import test from "node:test";

import { getArticleBySlug } from "@/lib/content/repository";
import { evaluateWorkflowTransition } from "@/lib/content/workflow";

const approvedArticle = getArticleBySlug("estate-plan-financial-checklist-for-caregivers");
const draftArticle = getArticleBySlug("student-emergency-fund-launch-plan");

if (!approvedArticle || !draftArticle) {
  throw new Error("Expected fixture articles for workflow tests.");
}

test("allows approved content to be scheduled by a publisher", () => {
  const result = evaluateWorkflowTransition({
    article: approvedArticle,
    nextState: "scheduled",
    actorName: "Evan Cole",
    actorRole: "publisher",
    scheduledFor: "2099-07-20T14:00:00.000Z",
  });

  assert.equal(result.allowed, true);
  assert.equal(result.reasons.length, 0);
  assert.ok(result.auditLog);
});

test("blocks draft content from publishing without human approval", () => {
  const result = evaluateWorkflowTransition({
    article: draftArticle,
    nextState: "published",
    actorName: "Evan Cole",
    actorRole: "publisher",
  });

  assert.equal(result.allowed, false);
  assert.ok(result.reasons.some((reason) => reason.includes("human editorial approval")));
});
