import languages from "../data/languages.json";

export function resolveLanguage(region) {
  return languages[region] || languages["us"];
}
