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
    supportedLanguages: ["es","en","fr"],
    supportedCurrencies: ["USD","DOP","JMD"],
    active: true
  }

];
