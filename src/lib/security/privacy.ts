export const CONSENT_COOKIE_NAME = "edunancial_consent";

export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function getDefaultConsentPreferences(): ConsentPreferences {
  return { ...DEFAULT_CONSENT };
}

export function parseConsentPreferences(
  rawValue?: string | null
): ConsentPreferences {
  if (!rawValue) {
    return getDefaultConsentPreferences();
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as Partial<ConsentPreferences>;

    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt:
        typeof parsed.updatedAt === "string" && parsed.updatedAt.length > 0
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return getDefaultConsentPreferences();
  }
}

export function serializeConsentPreferences(
  preferences: Pick<ConsentPreferences, "analytics" | "marketing">
): string {
  return encodeURIComponent(
    JSON.stringify({
      essential: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      updatedAt: new Date().toISOString(),
    } satisfies ConsentPreferences)
  );
}

function isSensitiveKey(key: string): boolean {
  return [
    "authorization",
    "cookie",
    "email",
    "ip",
    "password",
    "secret",
    "session",
    "token",
  ].some((fragment) => key.toLowerCase().includes(fragment));
}

export function redactSensitiveData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
        key,
        isSensitiveKey(key) ? "[REDACTED]" : redactSensitiveData(entryValue),
      ])
    );
  }

  return value;
}
