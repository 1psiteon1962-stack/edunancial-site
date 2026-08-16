import assert from "node:assert/strict";
import test from "node:test";

import {
  assertExpectedRenderingCount,
  assertUniqueRenderingIdentities,
  buildRenderingKey,
  parseRenderingIdentity,
} from "@/lib/curriculum/localization-identity";

test("rendering identity keeps jurisdiction independent from locale", () => {
  const canadianFrench = parseRenderingIdentity({
    lessonId: "red-l1-003",
    jurisdictionCode: "ca",
    localeCode: "fr_ca",
    adaptationType: "translation",
    sourceJurisdiction: "CA",
  });
  const usFrench = parseRenderingIdentity({
    lessonId: "RED-L1-003",
    jurisdictionCode: "US",
    localeCode: "fr-CA",
    adaptationType: "translation",
  });

  assert.equal(buildRenderingKey(canadianFrench), "RED-L1-003::CA::fr-CA");
  assert.equal(buildRenderingKey(usFrench), "RED-L1-003::US::fr-CA");
  assert.notEqual(buildRenderingKey(canadianFrench), buildRenderingKey(usFrench));
});

test("duplicate lesson/jurisdiction/locale renderings fail loudly", () => {
  const first = parseRenderingIdentity({ lessonId: "RED-L1-001", jurisdictionCode: "CA", localeCode: "fr-CA" });
  const duplicate = parseRenderingIdentity({ lessonId: "red-l1-001", jurisdictionCode: "ca", localeCode: "fr_ca" });

  assert.throws(
    () => assertUniqueRenderingIdentities([first, duplicate]),
    /Duplicate curriculum rendering identity detected/u,
  );
});

test("expected record count blocks partial batch publication", () => {
  const identities = [
    parseRenderingIdentity({ lessonId: "RED-L1-001", jurisdictionCode: "CA", localeCode: "fr-CA" }),
  ];

  assert.throws(
    () => assertExpectedRenderingCount(50, identities),
    /expected 50 renderings but validated 1/u,
  );
  assert.doesNotThrow(() => assertExpectedRenderingCount(1, identities));
});
