import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const ROOT=process.cwd();
test("Italian PURPLE L1 client-visible lesson assets exist with Italian title summary and body",()=>{
  for(let n=1;n<=3;n++){
    const id=`purple-l1-${String(n).padStart(3,"0")}`;
    const p=join(ROOT,"content","courses","purple","level-1","it",`purple-level-1-${id}-it.md`);
    assert.equal(existsSync(p),true,p);
    const raw=readFileSync(p,"utf8");
    assert.match(raw,/^title:\s*"(?!What |Common Law|Contracts 101)/m);
    assert.match(raw,/^summary:\s*"(?!Introduces )/m);
    assert.match(raw,/Versione italiana/);
  }
});
test("reader resolves sibling locale directories and localized filename suffixes",()=>{
  const raw=readFileSync(join(ROOT,"src","lib","curriculum","reader.ts"),"utf8");
  assert.match(raw,/levelDirectory/);
  assert.match(raw,/localeFilename/);
  assert.match(raw,/asset\.id\.toLowerCase\(\)/);
});
