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
    countries: [],
    languages: ["en","zh","ja","ko"],
    currencies: ["USD","JPY"]
  }

];
