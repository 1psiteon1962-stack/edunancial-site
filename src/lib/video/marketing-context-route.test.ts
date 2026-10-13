import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const source = readFileSync(path.join(process.cwd(), "src/app/api/admin/video/projects/route.ts"), "utf8");

test("marketing project API persists structured AI marketing context", () => {
  for (const field of ["sourceType", "countryCode", "audience", "platform", "marketingObjective", "campaignId", "sourceRef", "aiBrief"]) {
    assert.match(source, new RegExp(field), field);
  }
  assert.match(source, /defaultLocale: locale/);
  assert.match(source, /purpose: "marketing"/);
});

test("marketing project API validates market and attribution inputs", () => {
  assert.match(source, /\^\[A-Z\]\{2\}\$/);
  assert.match(source, /PLATFORMS\.has/);
  assert.match(source, /OBJECTIVES\.has/);
  assert.match(source, /AI brief must be an object/);
});

test("legacy Marketing Short creation remains compatible through defaults", () => {
  assert.match(source, /\?\? "en-US"/);
  assert.match(source, /\?\? "manual"/);
});
