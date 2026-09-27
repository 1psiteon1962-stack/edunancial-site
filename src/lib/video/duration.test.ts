import assert from "node:assert/strict";
import test from "node:test";
import { requireVideoR2CompositionDuration, videoR2CompositionDurationSeconds } from "./duration";
test("accepts 15 through 60 seconds",()=>{assert.equal(requireVideoR2CompositionDuration([{durationSeconds:15}]),15);assert.equal(requireVideoR2CompositionDuration([{durationSeconds:60}]),60);});
test("rejects outside 15 through 60 seconds",()=>{assert.throws(()=>requireVideoR2CompositionDuration([{durationSeconds:14.99}]),/between 15 and 60/);assert.throws(()=>requireVideoR2CompositionDuration([{durationSeconds:60.01}]),/between 15 and 60/);});
test("accounts for transition overlap",()=>{assert.equal(videoR2CompositionDurationSeconds([{durationSeconds:8},{durationSeconds:8,transitionSeconds:1}]),15);});
