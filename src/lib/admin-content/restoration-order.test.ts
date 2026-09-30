import assert from "node:assert/strict";
import test from "node:test";
import { orderVerifiedRestorationPackages } from "@/lib/admin-content/restoration-order";
import type { RestorationVerification } from "@/lib/admin-content/restoration-verification";
import type { RecoverableCurriculumPackage } from "@/lib/admin-content/recovery-discovery";

function verified(track:"red"|"blue", level:"level-2"|"level-3", language:"en-US"|"fr-CA"|"es-Caribbean"): RestorationVerification {
  const key=`${track.toUpperCase()}:L${level.replace("level-","")}:${language}`;
  const pkg:RecoverableCurriculumPackage={batchId:"batch_test",upload:{uploadId:key,originalFilename:key+".zip",mimeType:"application/zip",sizeBytes:0,storagePath:"uploads/courses/"+key+".zip"},identity:{track,level,language,title:"Test"},classificationError:null,reconciliationKey:key};
  return {reconciliationKey:key,package:pkg,status:"ready-single-package",candidateCount:1};
}

test("orders canonical packages before localized packages and exposes missing canonical prerequisites",()=>{
  const ordered=orderVerifiedRestorationPackages([
    verified("red","level-2","fr-CA"),
    verified("blue","level-3","es-Caribbean"),
    verified("red","level-2","en-US"),
  ]);
  assert.equal(ordered[0].phase,"canonical");
  assert.equal(ordered.find(x=>x.reconciliationKey==="RED:L2:fr-CA")?.blockedByCanonical,false);
  assert.equal(ordered.find(x=>x.reconciliationKey==="BLUE:L3:es-Caribbean")?.blockedByCanonical,true);
  assert.equal(ordered.find(x=>x.reconciliationKey==="BLUE:L3:es-Caribbean")?.canonicalKey,"BLUE:L3:en-US");
});
