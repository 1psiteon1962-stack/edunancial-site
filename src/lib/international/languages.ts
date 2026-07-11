export type LanguageDefinition = {
  code: string;
  label: string;
  nativeLabel: string;
  rtl: boolean;
};

export const LANGUAGE_CATALOG: readonly LanguageDefinition[] = [
  { code: "en", label: "English", nativeLabel: "English", rtl: false },
  { code: "es", label: "Spanish", nativeLabel: "Español", rtl: false },
  { code: "fr", label: "French", nativeLabel: "Français", rtl: false },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", rtl: false },
  { code: "de", label: "German", nativeLabel: "Deutsch", rtl: false },
  { code: "it", label: "Italian", nativeLabel: "Italiano", rtl: false },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", rtl: false },
  { code: "pl", label: "Polish", nativeLabel: "Polski", rtl: false },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", rtl: true },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", rtl: true },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", rtl: false },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", rtl: false },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", rtl: true },
  {
    code: "zh-Hans",
    label: "Chinese (Simplified)",
    nativeLabel: "中文 (简体)",
    rtl: false,
  },
  {
    code: "zh-Hant",
    label: "Chinese (Traditional)",
    nativeLabel: "中文 (繁體)",
    rtl: false,
  },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", rtl: false },
  { code: "ko", label: "Korean", nativeLabel: "한국어", rtl: false },
  { code: "ru", label: "Russian", nativeLabel: "Русский", rtl: false },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", rtl: false },
] as const;

export const DEFAULT_LANGUAGE_CODE = "en";
export const FALLBACK_LANGUAGE_CODE = "en";

export const LANGUAGE_ALIAS_MAP: Record<string, string> = {
  zh: "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-hk": "zh-Hant",
  "zh-mo": "zh-Hant",
};

export const LANGUAGE_ADMIN_STORAGE_KEY = "edunancial:language-admin";

export type LanguageAdminSettings = {
  enabledLanguages: string[];
  defaultLanguage: string;
  fallbackLanguage: string;
  rtlLanguages: string[];
  translationCompleteness: Record<string, number>;
};

export function getLanguageByCode(code: string) {
  return LANGUAGE_CATALOG.find((language) => language.code === code);
}

export function isLanguageSupported(code: string): boolean {
  return Boolean(getLanguageByCode(code));
}

export function normalizeLanguageCode(input: string | undefined | null): string {
  if (!input) {
    return DEFAULT_LANGUAGE_CODE;
  }

  const normalized = input.trim().toLowerCase();

  if (LANGUAGE_ALIAS_MAP[normalized]) {
    return LANGUAGE_ALIAS_MAP[normalized];
  }

  const exact = LANGUAGE_CATALOG.find(
    (language) => language.code.toLowerCase() === normalized
  );

  if (exact) {
    return exact.code;
  }

  const base = normalized.split("-")[0];

  if (LANGUAGE_ALIAS_MAP[base]) {
    return LANGUAGE_ALIAS_MAP[base];
  }

  const fromBase = LANGUAGE_CATALOG.find((language) => {
    const languageBase = language.code.toLowerCase().split("-")[0];
    return languageBase === base;
  });

  return fromBase?.code ?? DEFAULT_LANGUAGE_CODE;
}

export function isRtlLanguage(code: string): boolean {
  return getLanguageByCode(code)?.rtl ?? false;
}

export function getDefaultLanguageAdminSettings(): LanguageAdminSettings {
  const baseCompleteness = Object.fromEntries(
    LANGUAGE_CATALOG.map((language) => [
      language.code,
      language.code === DEFAULT_LANGUAGE_CODE ? 100 : 0,
    ])
  );

  return {
    enabledLanguages: LANGUAGE_CATALOG.map((language) => language.code),
    defaultLanguage: DEFAULT_LANGUAGE_CODE,
    fallbackLanguage: FALLBACK_LANGUAGE_CODE,
    rtlLanguages: LANGUAGE_CATALOG.filter((language) => language.rtl).map(
      (language) => language.code
    ),
    translationCompleteness: baseCompleteness,
  };
}

export function getStoredLanguageAdminSettings(): LanguageAdminSettings {
  const defaults = getDefaultLanguageAdminSettings();

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const rawSettings = localStorage.getItem(LANGUAGE_ADMIN_STORAGE_KEY);

    if (!rawSettings) {
      return defaults;
    }

    const parsedSettings = JSON.parse(rawSettings) as Partial<LanguageAdminSettings>;

    const enabledLanguages =
      parsedSettings.enabledLanguages?.filter(isLanguageSupported) ?? defaults.enabledLanguages;

    const defaultLanguage = isLanguageSupported(parsedSettings.defaultLanguage ?? "")
      ? parsedSettings.defaultLanguage ?? defaults.defaultLanguage
      : defaults.defaultLanguage;

    const fallbackLanguage = isLanguageSupported(parsedSettings.fallbackLanguage ?? "")
      ? parsedSettings.fallbackLanguage ?? defaults.fallbackLanguage
      : defaults.fallbackLanguage;

    const rtlLanguages =
      parsedSettings.rtlLanguages?.filter(isLanguageSupported) ?? defaults.rtlLanguages;

    return {
      enabledLanguages: enabledLanguages.length > 0 ? enabledLanguages : defaults.enabledLanguages,
      defaultLanguage,
      fallbackLanguage,
      rtlLanguages,
      translationCompleteness: {
        ...defaults.translationCompleteness,
        ...(parsedSettings.translationCompleteness ?? {}),
      },
    };
  } catch {
    return defaults;
  }
}

export function persistLanguageAdminSettings(settings: LanguageAdminSettings) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(LANGUAGE_ADMIN_STORAGE_KEY, JSON.stringify(settings));
}
