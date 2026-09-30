import assert from "node:assert/strict";
import test from "node:test";
import { buildRestorationPlan } from "@/lib/admin-content/restoration-plan";
import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

function pkg(key: string): RecoverableCurriculumPackage {
  const [track, level, language] = key.split(":");
  return { batchId:"batch_test", upload:{uploadId:key,originalFilename:key+".zip",mimeType:"application/zip",sizeBytes:0,storagePath:"uploads/courses/"+key+".zip"}, identity:{track:track.toLowerCase(),level:`level-${level.slice(1)}`,language}, classificationError:null, reconciliationKey:key } as RecoverableCurriculumPackage;
}
test("matches one recoverable package to a non-conflicting gap",()=>{const plan=buildRestorationPlan([{track:"RED",level:5,locale:"fr-CA",classification:"missing-localization"}],[pkg("RED:L5:fr-CA")]);assert.equal(plan.restorable.length,1);assert.equal(plan.unresolved.length,0);assert.equal(plan.conflicts.length,0);});
test("refuses absent duplicate and conflicting matches",()=>{const a=pkg("BLUE:L3:es-Caribbean"),b=pkg("BLUE:L3:es-Caribbean");const plan=buildRestorationPlan([{track:"BLUE",level:3,locale:"es-Caribbean",classification:"missing-localization"},{track:"GOLD",level:4,locale:"de",classification:"conflict"},{track:"WHITE",level:2,locale:"it",classification:"missing-localization"}],[a,b,pkg("BLACK:L1:nl")]);assert.equal(plan.restorable.length,0);assert.equal(plan.unresolved.length,2);assert.equal(plan.conflicts.length,1);assert.equal(plan.unmatchedPackages.length,3);});
