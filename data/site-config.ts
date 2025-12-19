// data/site-config.ts

export type SiteConfig = {
  siteName: string;
  tagline: string;
  defaultLocale: string;
  supportedLocales: string[];
};

const siteConfig: SiteConfig = {
  siteName: "Edunancial",
  tagline: "Where Education and Financial Literacy Meet",
  defaultLocale: "en",
  supportedLocales: ["en", "es"]
};

export default siteConfig;
