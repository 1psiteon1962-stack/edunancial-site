import assert from "node:assert/strict";
import test from "node:test";

import { classifyUserAgent, HUMAN_TRAFFIC_SQL } from "./bot-detection";

test("real browsers are counted as people", () => {
  for (const ua of [
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
  ]) {
    assert.equal(classifyUserAgent(ua).isBot, false, ua);
  }
});

test("automated clients observed on edunancial.com are flagged", () => {
  assert.equal(classifyUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/156.0.8078.80 Safari/537.36").isBot, true);
  assert.equal(classifyUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36").reason, "outdated_chrome_99");
  assert.equal(classifyUserAgent("android").isBot, true);
  assert.equal(classifyUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)").isBot, true);
  assert.equal(classifyUserAgent(null).isBot, true);
});

test("SQL predicate quotes safely", () => {
  assert.ok(HUMAN_TRAFFIC_SQL.includes("is_bot"));
  assert.equal((HUMAN_TRAFFIC_SQL.match(/'/gu) ?? []).length % 2, 0);
});
