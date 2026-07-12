export const languages = [
  "en",
  "es",
  "ko",
  "ja",
  "zh-Hans",
  "tl",
  "ar",
  "pt",
  "fr",
  "de",
  "it",
  "nl",
  "hi",
  "zh-Hant",
  "ht",
  // Europe expansion
  "pl",
  "cs",
  "sk",
  "ro",
  "bg",
  "lt",
  "lv",
  "et",
  "be",
  "ru",
  // Middle East expansion
  "he",
  "fa",
  "ps",
  "ur",
  // Asia expansion
  "yue-Hant",
  "vi",
  "ms",
  "id",
  "fil",
  "ta",
  "bn",
  "th",
  // Africa expansion
  "sw",
  "yo",
  "ha",
  "ig",
  "lg",
] as const;

export type SupportedLanguage = (typeof languages)[number];

export type Language = SupportedLanguage;

export type SupportedLanguageConfig = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
};

export const supportedLanguages: SupportedLanguageConfig[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "zh-Hans", label: "Chinese (Simplified)", nativeLabel: "中文 (简体)" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "zh-Hant", label: "Chinese (Traditional)", nativeLabel: "中文 (繁體)" },
  { code: "ht", label: "Haitian Creole", nativeLabel: "Kreyòl ayisyen" },
  { code: "pl", label: "Polish", nativeLabel: "Polski" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština" },
  { code: "sk", label: "Slovak", nativeLabel: "Slovenčina" },
  { code: "ro", label: "Romanian", nativeLabel: "Română" },
  { code: "bg", label: "Bulgarian", nativeLabel: "Български" },
  { code: "lt", label: "Lithuanian", nativeLabel: "Lietuvių" },
  { code: "lv", label: "Latvian", nativeLabel: "Latviešu" },
  { code: "et", label: "Estonian", nativeLabel: "Eesti" },
  { code: "be", label: "Belarusian", nativeLabel: "Беларуская" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית" },
  { code: "fa", label: "Persian", nativeLabel: "فارسی" },
  { code: "ps", label: "Pashto", nativeLabel: "پښتو" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو" },
  { code: "yue-Hant", label: "Cantonese", nativeLabel: "廣東話" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
  { code: "fil", label: "Filipino", nativeLabel: "Filipino" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "th", label: "Thai", nativeLabel: "ภาษาไทย" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili" },
  { code: "yo", label: "Yoruba", nativeLabel: "Yorùbá" },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa" },
  { code: "ig", label: "Igbo", nativeLabel: "Igbo" },
  { code: "lg", label: "Luganda", nativeLabel: "Luganda" },
];

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
