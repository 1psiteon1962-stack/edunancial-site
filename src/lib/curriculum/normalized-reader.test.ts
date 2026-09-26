import test from "node:test";
import assert from "node:assert/strict";
import { curriculumLessonId } from "./contract";
import { curriculumLocaleFallbackChain } from "./normalized-reader";

test("universal curriculum identity is level data, not level-specific architecture",()=>{
  assert.equal(curriculumLessonId("RED",1,1),"RED-L1-001");
  assert.equal(curriculumLessonId("RED",5,50),"RED-L5-050");
  assert.throws(()=>curriculumLessonId("BLUE",3,51));
});
test("locale fallback is driven by the central locale registry",()=>{
  assert.deepEqual(curriculumLocaleFallbackChain("es-Caribbean"),["es-Caribbean","es","en-US"]);
  assert.deepEqual(curriculumLocaleFallbackChain("en-GB"),["en-GB","en-US"]);
});
