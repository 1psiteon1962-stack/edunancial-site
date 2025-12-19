// data/site-config.ts

export interface SiteConfig {
  siteName: string;
  tagline: string;
  defaultLang: string;
  supportedLangs: string[];
}

const siteConfig: SiteConfig = {
  siteName: "Edunancial",
  tagline: "Where Education and Financial Literacy Meet",
  defaultLang: "en",
  supportedLangs: ["en", "es", "fr"]
};

export default siteConfig;
