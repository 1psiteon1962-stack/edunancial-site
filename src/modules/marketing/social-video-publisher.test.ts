import assert from "node:assert/strict";
import test from "node:test";
import { getSocialVideoPublisher, registerSocialVideoPublisher, SOCIAL_VIDEO_PLATFORMS } from "./social-video-publisher";

test("initial video distribution set includes every modeled launch platform", () => {
  assert.deepEqual([...SOCIAL_VIDEO_PLATFORMS], ["linkedin","facebook","instagram","x","tiktok","youtube"]);
});

test("unknown platforms fail closed", () => {
  assert.throws(() => getSocialVideoPublisher("unknown-network"), /Unsupported social video platform/);
});

test("known platform without connected adapter fails closed", () => {
  assert.throws(() => getSocialVideoPublisher("linkedin"), /No connected publishing adapter/);
});

test("registered adapters can be resolved without changing approval logic", () => {
  registerSocialVideoPublisher({
    platform: "youtube",
    async verifyConnection() {},
    async publishApprovedVideo() { return { remotePostId: "test" }; },
  });
  assert.equal(getSocialVideoPublisher("youtube").platform, "youtube");
});
