import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_VIDEO_R2_AUDIO_MIX, requireVideoR2AudioVolume, requireVideoR2ImageMimeType, requireVideoR2NarrationLocale } from "./media-contract";
test("keeps narration above background music by default",()=>assert.ok(DEFAULT_VIDEO_R2_AUDIO_MIX.narrationVolume>DEFAULT_VIDEO_R2_AUDIO_MIX.musicVolume));
test("validates narration locale",()=>{assert.equal(requireVideoR2NarrationLocale("ht"),"ht");assert.throws(()=>requireVideoR2NarrationLocale(" "),/required/);});
test("accepts generated image assets",()=>{assert.equal(requireVideoR2ImageMimeType("image/png"),"image/png");assert.throws(()=>requireVideoR2ImageMimeType("video/mp4"),/image MIME/);});
test("bounds narration and music volume",()=>{assert.equal(requireVideoR2AudioVolume(0.2,"music"),0.2);assert.throws(()=>requireVideoR2AudioVolume(3,"narration"),/between 0 and 2/);});
