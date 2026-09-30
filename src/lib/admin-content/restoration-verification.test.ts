import assert from "node:assert/strict";
import test from "node:test";
import { verifyExistingRestorationPackages } from "@/lib/admin-content/restoration-verification";
import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

function pkg(key: string, level: "level-1"|"level-2"|"level-3"|"level-4" = "level-2"): RecoverableCurriculumPackage {
  const [track,,language] = key.split(":");
  return {
    batchId: "batch_test",
    upload: { uploadId: key, originalFilename: key+".zip", mimeType:"application/zip", sizeBytes:0, storagePath:"uploads/courses/"+key+".zip" },
    identity: { track: track.toLowerCase() as NonNullable<RecoverableCurriculumPackage["identity"]>["track"], level, language: language as NonNullable<RecoverableCurriculumPackage["identity"]>["language"], title:"Test" },
    classificationError:null,
    reconciliationKey:key,
  };
}

test("only unique classified L1-L3 coordinates are ready", () => {
  const unique=pkg("RED:L2:fr-CA");
  const duplicateA=pkg("BLUE:L3:es-Caribbean","level-3");
  const duplicateB=pkg("BLUE:L3:es-Caribbean","level-3");
  const future=pkg("GOLD:L4:en-US","level-4");
  const result=verifyExistingRestorationPackages([unique,duplicateA,duplicateB,future]);
  assert.equal(result.find(x=>x.reconciliationKey==="RED:L2:fr-CA")?.status,"ready-single-package");
  assert.equal(result.filter(x=>x.reconciliationKey==="BLUE:L3:es-Caribbean").every(x=>x.status==="duplicate-coordinate"),true);
  assert.equal(result.find(x=>x.reconciliationKey==="GOLD:L4:en-US")?.status,"outside-current-l1-l3-scope");
});
