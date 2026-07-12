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
    case "zh-Hant":
      return (await import("./translations/zh-Hant")).default;
    case "hi":
      return (await import("./translations/hi")).default;
    case "tl":
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
    case "ht":
      return (await import("./translations/ht")).default;
    default:
      return (await import("./translations/en")).default;
  }
}
