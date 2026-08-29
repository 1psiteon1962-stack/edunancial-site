import { describe, expect, it } from "vitest";

import { detectTrustedRequestCountry, resolveRequestCountry } from "./request-country";

describe("request country resolution", () => {
  it("prefers Netlify country geography", () => {
    const headers = new Headers({ "x-nf-country": "CO" });
    expect(detectTrustedRequestCountry(headers)).toEqual({ countryCode: "CO", source: "netlify-country" });
  });

  it("reads Netlify geo JSON when country header is unavailable", () => {
    const headers = new Headers({ "x-nf-geo": JSON.stringify({ country: { code: "BR" } }) });
    expect(detectTrustedRequestCountry(headers)).toEqual({ countryCode: "BR", source: "netlify-geo" });
  });

  it("surfaces client and network country mismatch", () => {
    const headers = new Headers({ "x-nf-country": "MX" });
    expect(resolveRequestCountry(headers, "US")).toMatchObject({
      countryCode: "MX",
      detectedCountryCode: "MX",
      requestedCountryCode: "US",
      mismatch: true,
    });
  });

  it("uses explicit client country only when trusted network geography is absent", () => {
    expect(resolveRequestCountry(new Headers(), "CA")).toEqual({
      countryCode: "CA",
      source: "client",
      detectedCountryCode: null,
      requestedCountryCode: "CA",
      mismatch: false,
    });
  });

  it("never invents a default country", () => {
    expect(resolveRequestCountry(new Headers())).toBeNull();
  });
});
