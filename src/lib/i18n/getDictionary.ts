export async function getDictionary(lang: string) {
  switch (lang) {
    case "es":
      return (await import("./translations/es")).default;
    case "ko":
      return (await import("./translations/ko")).default;
    case "ja":
      return (await import("./translations/ja")).default;
    case "zh-Hans":
      return (await import("./translations/zh-Hans")).default;
    case "tl":
    case "fil":
      return (await import("./translations/tl")).default;
    case "ar":
      return (await import("./translations/ar")).default;
    case "pt":
      return (await import("./translations/pt")).default;
    case "fr-CA":
      return (await import("./translations/fr-CA")).default;
    case "fr":
      return (await import("./translations/fr")).default;
    case "de":
      return (await import("./translations/de")).default;
    case "it":
      return (await import("./translations/it")).default;
    case "nl":
      return (await import("./translations/nl")).default;
    case "hi":
      return (await import("./translations/hi")).default;
    case "zh-Hant":
      return (await import("./translations/zh-Hant")).default;
    case "yue-Hant":
      // Cantonese: scaffold falls back to Traditional Chinese
      return (await import("./translations/zh-Hant")).default;
    case "ht":
      return (await import("./translations/ht")).default;
    // Europe expansion — scaffold falls back to English
    case "pl":
    case "cs":
    case "sk":
    case "ro":
    case "bg":
    case "lt":
    case "lv":
    case "et":
    case "be":
    case "ru":
    // Middle East expansion — scaffold falls back to English
    case "he":
    case "fa":
    case "ps":
    case "ur":
    // Asia expansion — scaffold falls back to English
    case "vi":
    case "ms":
    case "id":
    case "bn":
    case "ta":
    case "th":
    // Africa expansion — scaffold falls back to English
    case "sw":
    case "yo":
    case "ha":
    case "ig":
    case "lg":
      return (await import("./translations/en")).default;
    default:
      return (await import("./translations/en")).default;
  }
}
