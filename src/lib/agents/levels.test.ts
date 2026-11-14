import { test } from "node:test";
import assert from "node:assert/strict";
import { canPerform, requiresOwnerApproval, type AuthorityLevel } from "./levels";
import { decideAgentTask } from "./orchestrator";

const LEVELS: AuthorityLevel[] = ["GREEN", "YELLOW", "ORANGE", "RED"];

test("a lower level cannot perform a higher-level action", () => {
  assert.equal(canPerform("GREEN", "ORANGE"), false);
  assert.equal(canPerform("GREEN", "YELLOW"), false);
  assert.equal(canPerform("YELLOW", "ORANGE"), false);
});

test("an agent can perform actions at or below its level", () => {
  assert.equal(canPerform("ORANGE", "ORANGE"), true);
  assert.equal(canPerform("ORANGE", "GREEN"), true);
  assert.equal(canPerform("YELLOW", "YELLOW"), true);
  assert.equal(canPerform("GREEN", "GREEN"), true);
});

test("no level can ever perform a RED action", () => {
  for (const level of LEVELS) assert.equal(canPerform(level, "RED"), false, level);
});

test("unknown levels fail closed", () => {
  assert.equal(canPerform("ADMIN" as AuthorityLevel, "GREEN"), false);
  assert.equal(canPerform("ORANGE", "BLUE" as AuthorityLevel), false);
});

test("ORANGE and RED require owner approval", () => {
  assert.equal(requiresOwnerApproval("ORANGE"), true);
  assert.equal(requiresOwnerApproval("RED"), true);
  assert.equal(requiresOwnerApproval("YELLOW"), false);
  assert.equal(requiresOwnerApproval("GREEN"), false);
});

test("orchestrator refuses unregistered, disabled and over-level agents", () => {
  assert.equal(decideAgentTask(null, "GREEN").kind, "refuse");
  assert.equal(decideAgentTask({ enabled: false, maxLevel: "ORANGE" }, "GREEN").kind, "refuse");
  assert.equal(decideAgentTask({ enabled: true, maxLevel: "GREEN" }, "ORANGE").kind, "refuse");
  assert.equal(decideAgentTask({ enabled: true, maxLevel: "ORANGE" }, "RED").kind, "refuse");
});

test("orchestrator routes ORANGE to approval and queues lower levels", () => {
  assert.equal(decideAgentTask({ enabled: true, maxLevel: "ORANGE" }, "ORANGE").kind, "await_approval");
  assert.equal(decideAgentTask({ enabled: true, maxLevel: "ORANGE" }, "YELLOW").kind, "queue");
  assert.equal(decideAgentTask({ enabled: true, maxLevel: "GREEN" }, "GREEN").kind, "queue");
});
