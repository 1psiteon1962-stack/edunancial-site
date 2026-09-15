import test from "node:test";
import assert from "node:assert/strict";

import { HOME_GOALS, HOME_GOAL_IMAGE_PATHS } from "./home-goal-images";

test("maps every homepage goal to one local image path", () => {
  const mappedGoals=Object.keys(HOME_GOAL_IMAGE_PATHS).sort();
  const expectedGoals=[...HOME_GOALS].sort();

  assert.deepEqual(mappedGoals,expectedGoals);

  const mappedPaths=Object.values(HOME_GOAL_IMAGE_PATHS);
  assert.equal(mappedPaths.length,6);
  assert.equal(new Set(mappedPaths).size,6);
  assert.ok(mappedPaths.every((path)=>path.startsWith("/images/home/goals/")));
  assert.ok(mappedPaths.every((path)=>path!=="\/images/home/goals/approved-goals.jpg"));
});
