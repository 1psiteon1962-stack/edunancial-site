import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { detectTrustedRequestCountry, resolveRequestCountry } from "./request-country";

describe("request country resolution", () => {
  test("prefers Netlify country geography", () => {
    const headers = new Headers({ "x-nf-country": "CO" });
    assert.deepEqual(detectTrustedRequestCountry(headers), { countryCode: "CO", source: "netlify-country" });
  });

  test("reads Netlify geo JSON when country header is unavailable", () => {
    const headers = new Headers({ "x-nf-geo": JSON.stringify({ country: { code: "BR" } }) });
    assert.deepEqual(detectTrustedRequestCountry(headers), { countryCode: "BR", source: "netlify-geo" });
  });

  test("surfaces client and network country mismatch", () => {
    const headers = new Headers({ "x-nf-country": "MX" });
    const result = resolveRequestCountry(headers, "US");
    assert.equal(result?.countryCode, "MX");
    assert.equal(result?.detectedCountryCode, "MX");
    assert.equal(result?.requestedCountryCode, "US");
    assert.equal(result?.mismatch, true);
  });

  test("uses explicit client country only when trusted network geography is absent", () => {
    assert.deepEqual(resolveRequestCountry(new Headers(), "CA"), {
      countryCode: "CA",
      source: "client",
      detectedCountryCode: null,
      requestedCountryCode: "CA",
      mismatch: false,
    });
  });

  test("never invents a default country", () => {
    assert.equal(resolveRequestCountry(new Headers()), null);
  });
});
