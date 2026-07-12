export const APAC_LOCALES = ["en", "ja", "ko", "zh-Hans", "zh-Hant", "hi"] as const;

export type ApacLocale = (typeof APAC_LOCALES)[number];

export interface ApacLocaleConfig {
  code: ApacLocale;
  label: string;
  nativeLabel: string;
  hreflang: string;
  defaultCurrency: string;
  primaryMarkets: string[];
}

export const APAC_LOCALE_CONFIG: readonly ApacLocaleConfig[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    hreflang: "en-SG",
    defaultCurrency: "SGD",
    primaryMarkets: ["SG", "AU", "NZ", "PH", "MY"],
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    hreflang: "ja-JP",
    defaultCurrency: "JPY",
    primaryMarkets: ["JP"],
  },
  {
    code: "ko",
    label: "Korean",
    nativeLabel: "한국어",
    hreflang: "ko-KR",
    defaultCurrency: "KRW",
    primaryMarkets: ["KR"],
  },
  {
    code: "zh-Hans",
    label: "Chinese (Simplified)",
    nativeLabel: "中文 (简体)",
    hreflang: "zh-Hans",
    defaultCurrency: "CNY",
    primaryMarkets: ["CN", "SG"],
  },
  {
    code: "zh-Hant",
    label: "Chinese (Traditional)",
    nativeLabel: "中文 (繁體)",
    hreflang: "zh-Hant",
    defaultCurrency: "TWD",
    primaryMarkets: ["TW", "HK"],
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    hreflang: "hi-IN",
    defaultCurrency: "INR",
    primaryMarkets: ["IN"],
  },
];

export function getApacLocaleConfig(code: string): ApacLocaleConfig | undefined {
  return APAC_LOCALE_CONFIG.find((l) => l.code === code);
}

export function getApacHreflangAlternates(
  baseUrl: string,
  path: string
): Array<{ hreflang: string; href: string }> {
  return [
    ...APAC_LOCALE_CONFIG.map((locale) => ({
      hreflang: locale.hreflang,
      href: `${baseUrl}/asia-pacific/${locale.code}${path}`,
    })),
    { hreflang: "x-default", href: `${baseUrl}/asia-pacific${path}` },
  ];
}
