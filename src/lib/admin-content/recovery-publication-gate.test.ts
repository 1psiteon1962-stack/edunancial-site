import assert from "node:assert/strict";
import test from "node:test";
import { recoveryPublicationEnabled } from "@/lib/admin-content/recovery-publication-gate";

test("recovery publication is fail-closed by default", () => {
  assert.equal(recoveryPublicationEnabled({} as NodeJS.ProcessEnv), false);
  assert.equal(recoveryPublicationEnabled({ EDUNANCIAL_ENABLE_CURRICULUM_RECOVERY: "false" } as NodeJS.ProcessEnv), false);
});
test("recovery publication requires explicit true", () => {
  assert.equal(recoveryPublicationEnabled({ EDUNANCIAL_ENABLE_CURRICULUM_RECOVERY: "true" } as NodeJS.ProcessEnv), true);
  assert.equal(recoveryPublicationEnabled({ EDUNANCIAL_ENABLE_CURRICULUM_RECOVERY: " TRUE " } as NodeJS.ProcessEnv), true);
});
