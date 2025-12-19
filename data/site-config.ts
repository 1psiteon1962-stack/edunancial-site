// data/site-config.ts

export type Locale = "en" | "es" | "fr";

export interface SiteConfig {
  siteName: string;
  tagline: string;
  defaultLang: Locale;
  supportedLangs: Locale[];
}

const siteConfig: SiteConfig = {
  siteName: "Edunancial",
  tagline: "Where Education and Financial Literacy Meet",
  defaultLang: "en",
  supportedLangs: ["en", "es", "fr"]
};

export default siteConfig;
