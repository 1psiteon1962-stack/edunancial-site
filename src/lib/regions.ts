export interface Region {

  id: string;

  name: string;

  countries: string[];

  defaultLanguages: string[];

}

export const regions: Region[] = [

  {
    id: "north-america",
    name: "North America",
    countries: [
      "United States",
      "Canada"
    ],
    defaultLanguages: [
      "en",
      "es",
      "fr"
    ]
  },

  {
    id: "latin-america",
    name: "Latin America",
    countries: [
      "Mexico",
      "Puerto Rico",
      "Dominican Republic",
      "Central America",
      "South America"
    ],
    defaultLanguages: [
      "es",
      "en",
      "pt"
    ]
  },

  {
    id: "africa",
    name: "Africa",
    countries: [],
    defaultLanguages: [
      "en",
      "fr",
      "sw",
      "ar"
    ]
  },

  {
    id: "europe",
    name: "Europe",
    countries: [],
    defaultLanguages: [
      "en",
      "fr",
      "de",
      "es",
      "it"
    ]
  },

  {
    id: "asia",
    name: "Asia",
    countries: [],
    defaultLanguages: [
      "en",
      "zh",
      "ja",
      "ko",
      "hi"
    ]
  }

];
