import {
  APAC_CURRENCY_REGISTRY,
  APAC_FOUNDATION_COUNTRIES,
  APAC_LANGUAGE_REGISTRY,
} from "@/lib/regionalization/apacFoundation";

export interface GlobalHierarchy {

  region: string;

  countries: string[];

  languages: string[];

  currencies: string[];

}

export const GLOBAL_HIERARCHY: GlobalHierarchy[] = [

  {
    region: "North America",
    countries: ["US","CA"],
    languages: ["en","es","fr"],
    currencies: ["USD","CAD"]
  },

  {
    region: "Caribbean",
    countries: [
      "PR","DO","CU","JM","HT",
      "BS","BB","TT","GD","LC"
    ],
    languages: [
      "en",
      "es",
      "fr",
      "ht"
    ],
    currencies: [
      "USD",
      "DOP",
      "JMD",
      "HTG"
    ]
  },

  {
    region: "Latin America",
    countries: [],
    languages: ["es","pt","en"],
    currencies: ["USD"]
  },

  {
    region: "Europe",
    countries: [],
    languages: ["en","fr","de","it","es"],
    currencies: ["EUR","GBP","CHF"]
  },

  {
    region: "Africa",
    countries: [],
    languages: ["en","fr","ar","sw"],
    currencies: ["USD"]
  },

  {
    region: "Middle East",
    countries: [],
    languages: ["ar","en"],
    currencies: ["USD"]
  },

  {
    region: "Asia Pacific",
    countries: APAC_FOUNDATION_COUNTRIES.map((country) => country.isoCode),
    languages: APAC_LANGUAGE_REGISTRY.map((language) => language.code),
    currencies: APAC_CURRENCY_REGISTRY.map((currency) => currency.code)
  }

];
