export type LanguageDefinition = {
  code: string;
  label: string;
  nativeLabel: string;
  rtl: boolean;
};

export const LANGUAGE_CATALOG: readonly LanguageDefinition[] = [
  {
    code: "en-US",
    label: "English (United States)",
    nativeLabel: "English (United States)",
    rtl: false,
  },
  { code: "es", label: "Spanish", nativeLabel: "Español", rtl: false },
  {
    code: "fr-CA",
    label: "French (Canada)",
    nativeLabel: "Français (Canada)",
    rtl: false,
  },
  {
    code: "fr-FR",
    label: "French (France)",
    nativeLabel: "Français (France)",
    rtl: false,
  },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", rtl: false },
  { code: "de", label: "German", nativeLabel: "Deutsch", rtl: false },
  { code: "it", label: "Italian", nativeLabel: "Italiano", rtl: false },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", rtl: false },
  { code: "ht", label: "Haitian Creole", nativeLabel: "Kreyòl Ayisyen", rtl: false },
  { code: "pap", label: "Papiamento", nativeLabel: "Papiamentu", rtl: false },
  { code: "pl", label: "Polish", nativeLabel: "Polski", rtl: false },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", rtl: true },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", rtl: true },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", rtl: false },
  { code: "th", label: "Thai", nativeLabel: "ภาษาไทย", rtl: false },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", rtl: false },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", rtl: false },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", rtl: false },
  { code: "fil", label: "Filipino", nativeLabel: "Filipino", rtl: false },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", rtl: false },
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
  { code: "cs", label: "Czech", nativeLabel: "Čeština", rtl: false },
  { code: "sk", label: "Slovak", nativeLabel: "Slovenčina", rtl: false },
  { code: "ro", label: "Romanian", nativeLabel: "Română", rtl: false },
  { code: "bg", label: "Bulgarian", nativeLabel: "Български", rtl: false },
  { code: "lt", label: "Lithuanian", nativeLabel: "Lietuvių", rtl: false },
  { code: "lv", label: "Latvian", nativeLabel: "Latviešu", rtl: false },
  { code: "et", label: "Estonian", nativeLabel: "Eesti", rtl: false },
  { code: "be", label: "Belarusian", nativeLabel: "Беларуская", rtl: false },
  { code: "ru", label: "Russian", nativeLabel: "Русский", rtl: false },
  { code: "fa", label: "Farsi (Persian)", nativeLabel: "فارسی", rtl: true },
  { code: "prs", label: "Dari", nativeLabel: "دری", rtl: true },
  { code: "ps", label: "Pashto", nativeLabel: "پښتو", rtl: true },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", rtl: false },
  { code: "lg", label: "Luganda", nativeLabel: "Luganda", rtl: false },
  { code: "yo", label: "Yoruba", nativeLabel: "Yorùbá", rtl: false },
  { code: "ig", label: "Igbo", nativeLabel: "Igbo", rtl: false },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa", rtl: false },
  { code: "zu", label: "Zulu", nativeLabel: "isiZulu", rtl: false },
  { code: "am", label: "Amharic", nativeLabel: "አማርኛ", rtl: false },
] as const;

export const DEFAULT_LANGUAGE_CODE = "en-US";
export const FALLBACK_LANGUAGE_CODE = "en-US";

export const LANGUAGE_ALIAS_MAP: Record<string, string> = {
  en: "en-US",
  fr: "fr-CA",
  zh: "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-hk": "zh-Hant",
  "zh-mo": "zh-Hant",
  tl: "fil",
};

export const FRAMEWORK_READY_LANGUAGE_CODES = [
  "pap",
  "sw", "lg", "yo", "ig", "ha", "zu", "am",
  "th", "vi", "ms", "id", "fil", "ta", "bn",
  "cs", "sk", "ro", "bg", "lt", "lv", "et", "be", "fa", "prs", "ps",
] as const;

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

  const exact = LANGUAGE_CATALOG.find(
    (language) => language.code.toLowerCase() === normalized
  );

  if (exact) {
    return exact.code;
  }

  if (LANGUAGE_ALIAS_MAP[normalized]) {
    return LANGUAGE_ALIAS_MAP[normalized];
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
      parsedSettings.enabledLanguages
        ?.map((language) => normalizeLanguageCode(language))
        .filter(isLanguageSupported) ?? defaults.enabledLanguages;

    const defaultLanguage = normalizeLanguageCode(parsedSettings.defaultLanguage);
    const fallbackLanguage = normalizeLanguageCode(parsedSettings.fallbackLanguage);

    const rtlLanguages =
      parsedSettings.rtlLanguages
        ?.map((language) => normalizeLanguageCode(language))
        .filter(isLanguageSupported) ?? defaults.rtlLanguages;

    return {
      enabledLanguages: enabledLanguages.length > 0 ? enabledLanguages : defaults.enabledLanguages,
      defaultLanguage: isLanguageSupported(defaultLanguage)
        ? defaultLanguage
        : defaults.defaultLanguage,
      fallbackLanguage: isLanguageSupported(fallbackLanguage)
        ? fallbackLanguage
        : defaults.fallbackLanguage,
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
