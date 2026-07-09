"use client";

import {
  CONSENT_COOKIE_NAME,
  getDefaultConsentPreferences,
  parseConsentPreferences,
  type ConsentPreferences,
} from "./privacy";
import { CSRF_COOKIE_NAME } from "./csrf";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  for (const part of document.cookie.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

export function getBrowserCsrfToken(): string | null {
  return readCookie(CSRF_COOKIE_NAME);
}

export function getBrowserConsentPreferences(): ConsentPreferences {
  return parseConsentPreferences(readCookie(CONSENT_COOKIE_NAME)) ?? getDefaultConsentPreferences();
}

export function hasBrowserConsent(category: "analytics" | "marketing"): boolean {
  return getBrowserConsentPreferences()[category];
}

export function createProtectedJsonHeaders(): HeadersInit {
  const csrfToken = getBrowserCsrfToken();

  return {
    "Content-Type": "application/json",
    "x-csrf-token": csrfToken ?? "",
    "x-requested-with": "edunancial-web",
  };
}
