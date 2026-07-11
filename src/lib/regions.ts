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
    countries: [
      "Algeria","Egypt","Libya","Morocco","Sudan","Tunisia","Western Sahara",
      "Burundi","Comoros","Djibouti","Eritrea","Ethiopia","Kenya","Madagascar",
      "Malawi","Mauritius","Mozambique","Rwanda","Réunion","Seychelles","Somalia",
      "South Sudan","Tanzania","Uganda","Zambia","Zimbabwe",
      "Benin","Burkina Faso","Cape Verde","Côte d'Ivoire","Gambia","Ghana","Guinea",
      "Guinea-Bissau","Liberia","Mali","Mauritania","Niger","Nigeria","Saint Helena",
      "Senegal","Sierra Leone","Togo",
      "Angola","Cameroon","Central African Republic","Chad","Republic of the Congo",
      "DR Congo","Equatorial Guinea","Gabon","São Tomé and Príncipe",
      "Botswana","Eswatini","Lesotho","Namibia","South Africa"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "ar",
      "pt",
      "sw"
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
