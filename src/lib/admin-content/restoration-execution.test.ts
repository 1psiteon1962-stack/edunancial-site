import assert from "node:assert/strict";
import test from "node:test";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

function pkg(level: "level-1"|"level-2"|"level-3"|"level-4"|"level-5"): RecoverableCurriculumPackage {
  return {
    batchId: "batch_test",
    upload: { uploadId: "upload_test", originalFilename: `RED-${level}-en-US.zip`, mimeType: "application/zip", sizeBytes: 0, storagePath: `uploads/courses/batch_test/upload_test-RED-${level}-en-US.zip` },
    identity: { track: "red", level, language: "en-US", title: "Test" },
    classificationError: null,
    reconciliationKey: `RED:L${level.replace("level-","")}:en-US`,
  };
}

test("current recovery execution targets existing L1-L3 packages", () => {
  const selected = selectExistingRestorationCandidates([pkg("level-1"),pkg("level-2"),pkg("level-3"),pkg("level-4"),pkg("level-5")]);
  assert.deepEqual(selected.map(x=>x.eligible), [true,true,true,false,false]);
});
