import { APAC_FOUNDATION_COUNTRIES, APAC_LANGUAGE_REGISTRY } from "@/lib/regionalization/apacFoundation";

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
    countries: APAC_FOUNDATION_COUNTRIES.map((country) => country.country),
    defaultLanguages: APAC_LANGUAGE_REGISTRY.map((language) => language.code)
  }

];
