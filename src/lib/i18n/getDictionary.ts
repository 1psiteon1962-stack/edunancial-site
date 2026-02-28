export async function getDictionary(lang: string) {
  switch (lang) {
    case "es":
      return (await import("./translations/es")).default;
    case "ko":
      return (await import("./translations/ko")).default;
    case "ja":
      return (await import("./translations/ja")).default;
    case "tl":
      return (await import("./translations/tl")).default;
    case "ar":
      return (await import("./translations/ar")).default;
    case "pt":
      return (await import("./translations/pt")).default;
    case "fr":
      return (await import("./translations/fr")).default;
    default:
      return (await import("./translations/en")).default;
  }
}
