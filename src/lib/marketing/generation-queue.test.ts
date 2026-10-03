import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const source=fs.readFileSync(path.join(root,"src/lib/marketing/generation-queue.ts"),"utf8");
const drafts=fs.readFileSync(path.join(root,"src/app/api/admin/marketing/drafts/route.ts"),"utf8");
const expand=fs.readFileSync(path.join(root,"src/app/api/admin/marketing/content/[contentId]/expand/route.ts"),"utf8");

test("marketing generation remains fail-closed",()=>{
 assert.match(source,/status\)!=="approved"/);
 assert.match(source,/status,'review'/);
 assert.doesNotMatch(source,/status,'published'/);
 assert.match(source,/marketing_platforms where enabled=true/);
});

test("marketing generation APIs require owner and CSRF protected writes",()=>{
 assert.match(drafts,/requireOwnerApiSession\(request,true\)/);
 assert.match(expand,/requireOwnerApiSession\(request,true\)/);
});
