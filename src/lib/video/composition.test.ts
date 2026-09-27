import assert from "node:assert/strict";
import test from "node:test";
import { requireVideoR2FrozenComposition, videoR2CompositionHash, type VideoR2FrozenComposition } from "./composition";
const base: VideoR2FrozenComposition={version:1,locale:"en-US",outputProfile:"vertical",scenes:[{assetId:"a",storageKey:"v1/projects/p/sources/a.png",mimeType:"image/png",durationSeconds:15,fit:"contain"}],audio:[]};
test("freezes an immutable render-ready composition",()=>assert.equal(requireVideoR2FrozenComposition(base),base));
test("hash is deterministic",()=>assert.equal(videoR2CompositionHash(base),videoR2CompositionHash(base)));
test("rejects missing immutable scene asset",()=>assert.throws(()=>requireVideoR2FrozenComposition({...base,scenes:[{...base.scenes[0],storageKey:""}]}),/ready immutable asset/));
test("inherits 15-60 second final runtime rule",()=>assert.throws(()=>requireVideoR2FrozenComposition({...base,scenes:[{...base.scenes[0],durationSeconds:61}]}),/between 15 and 60/));
