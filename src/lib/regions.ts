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
      "en-US",
      "es",
      "fr-CA",
      "fr-FR"
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
    id: "europe-2a",
    name: "Europe 2A",
    countries: [
      "Western Europe",
      "United Kingdom",
      "EU Core Markets"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "de",
      "es",
      "it"
    ]
  },

  {
    id: "europe-2b",
    name: "Europe 2B",
    countries: [
      "Eastern Europe",
      "Central Europe",
      "Expansion Markets"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "de",
      "es",
      "it"
    ]
  },

  {
    id: "latin-america-2a",
    name: "Latin America 2A",
    countries: [
      "Mexico",
      "Central America",
      "Northern South America"
    ],
    defaultLanguages: [
      "es",
      "pt",
      "en"
    ]
  },

  {
    id: "latin-america-2b",
    name: "Latin America 2B",
    countries: [
      "Brazil",
      "Argentina",
      "Southern South America"
    ],
    defaultLanguages: [
      "pt",
      "es",
      "en"
    ]
  },

  {
    id: "africa",
    name: "Africa",
    countries: [
      "East Africa",
      "West Africa",
      "Southern Africa"
    ],
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
    id: "middle-east",
    name: "Middle East",
    countries: [
      "Gulf Cooperation Council",
      "Levant",
      "Middle East Growth Markets"
    ],
    defaultLanguages: [
      "ar",
      "en",
      "fr"
    ]
  },

  {
    id: "asia",
    name: "Asia",
    countries: [
      "East Asia",
      "South Asia",
      "Southeast Asia"
    ],
    defaultLanguages: [
      "en",
      "zh",
      "ja",
      "ko",
      "hi"
    ]
  },

  {
    id: "oceania",
    name: "Oceania",
    countries: [
      "Australia",
      "New Zealand",
      "Pacific Islands"
    ],
    defaultLanguages: [
      "en"
    ]
  }

];
