export interface RegionalSettings {

  region: string;

  defaultLanguage: string;

  defaultCurrency: string;

  supportedLanguages: string[];

  supportedCurrencies: string[];

  active: boolean;

}

export const regionalSettings: RegionalSettings[] = [

  {
    region: "north-america",
    defaultLanguage: "en",
    defaultCurrency: "USD",
    supportedLanguages: ["en","es","fr"],
    supportedCurrencies: ["USD","CAD"],
    active: true
  },

  {
    region: "caribbean",
    defaultLanguage: "es",
    defaultCurrency: "USD",
    supportedLanguages: ["es","en","fr","nl","ht","pap"],
    supportedCurrencies: ["USD","DOP","JMD"],
    active: true
  },

  {
    region: "europe-2a",
    defaultLanguage: "en",
    defaultCurrency: "EUR",
    supportedLanguages: ["en","fr","de","es","pt","it","nl"],
    supportedCurrencies: ["EUR","GBP","CHF"],
    active: true
  },

  {
    region: "europe-2b",
    defaultLanguage: "en",
    defaultCurrency: "EUR",
    supportedLanguages: ["en","fr","de","es","pt","it","nl"],
    supportedCurrencies: ["EUR","PLN","CZK","HUF"],
    active: true
  },

  {
    region: "latin-america-2a",
    defaultLanguage: "es",
    defaultCurrency: "USD",
    supportedLanguages: ["es","pt","en"],
    supportedCurrencies: ["USD","MXN","COP","PEN"],
    active: true
  },

  {
    region: "latin-america-2b",
    defaultLanguage: "pt",
    defaultCurrency: "USD",
    supportedLanguages: ["pt","es","en"],
    supportedCurrencies: ["USD","BRL","ARS","CLP"],
    active: true
  },

  {
    region: "africa",
    defaultLanguage: "en",
    defaultCurrency: "USD",
    supportedLanguages: ["en","fr","ar","pt","sw","yo","zu","am"],
    supportedCurrencies: ["USD","NGN","KES","ZAR","EGP"],
    active: true
  },

  {
    region: "middle-east",
    defaultLanguage: "ar",
    defaultCurrency: "USD",
    supportedLanguages: ["ar","en","fr"],
    supportedCurrencies: ["USD","AED","SAR","QAR"],
    active: true
  },

  {
    region: "asia",
    defaultLanguage: "en",
    defaultCurrency: "USD",
    supportedLanguages: ["en","ja","ko","zh-Hans","zh-Hant","hi","th","vi","ms","id","fil","ta","bn"],
    supportedCurrencies: ["USD","JPY","KRW","CNY","TWD","HKD","SGD","INR","AUD","NZD","PHP","THB","MYR","IDR","VND"],
    active: true
  },

  {
    region: "oceania",
    defaultLanguage: "en",
    defaultCurrency: "AUD",
    supportedLanguages: ["en"],
    supportedCurrencies: ["AUD","NZD"],
    active: true
  }

];
