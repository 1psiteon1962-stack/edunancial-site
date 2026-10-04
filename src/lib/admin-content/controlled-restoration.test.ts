import assert from "node:assert/strict";
import test from "node:test";
import { selectExistingRestorationCandidates } from "@/lib/admin-content/restoration-execution";
import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

function candidate(level: "level-1"|"level-2"|"level-3"|"level-4"): RecoverableCurriculumPackage {
  return { batchId:"batch_x", upload:{uploadId:"upload_x",originalFilename:`red-${level}-en-US.zip`,mimeType:"application/zip",sizeBytes:0,storagePath:`uploads/courses/batch_x/upload_x-red-${level}-en-US.zip`}, identity:{track:"red",level,language:"en-US",title:"Recovery"}, classificationError:null, reconciliationKey:`RED:L${level.replace("level-","")}:en-US` };
}
test("controlled restoration admits supported L1-L4 uploads",()=>{
 const r=selectExistingRestorationCandidates([candidate("level-1"),candidate("level-2"),candidate("level-3"),candidate("level-4")]);
 assert.deepEqual(r.map(x=>x.eligible),[true,true,true,true]);
});
