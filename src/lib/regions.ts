export interface Region {

  id: string;

  name: string;

  /** Parent region id, if this is a sub-segment */
  parentId?: string;

  countries: string[];

  defaultLanguages: string[];

  /** Route path for this architectural segment */
  path: string;

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
    ],
    path: "/north-america"
  },

  // ── Europe (two architectural segments) ──────────────────────────────────

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
    ],
    path: "/europe"
  },

  {
    id: "europe-2a",
    name: "Europe 2A — Western Europe",
    parentId: "europe",
    countries: [
      "United Kingdom",
      "France",
      "Germany",
      "Spain",
      "Italy",
      "Netherlands",
      "Belgium",
      "Sweden",
      "Switzerland",
      "Austria",
      "Denmark",
      "Norway",
      "Finland",
      "Ireland",
      "Luxembourg"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "de",
      "es",
      "it"
    ],
    path: "/europe/2a"
  },

  {
    id: "europe-2b",
    name: "Europe 2B — Central & Eastern Europe",
    parentId: "europe",
    countries: [
      "Poland",
      "Romania",
      "Czech Republic",
      "Hungary",
      "Greece",
      "Portugal",
      "Croatia",
      "Slovakia",
      "Bulgaria",
      "Slovenia",
      "Lithuania",
      "Latvia",
      "Estonia",
      "Serbia",
      "Ukraine"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "de"
    ],
    path: "/europe/2b"
  },

  // ── Latin America (two architectural segments) ───────────────────────────

  {
    id: "latin-america",
    name: "Latin America",
    countries: [],
    defaultLanguages: [
      "es",
      "en",
      "pt"
    ],
    path: "/latin-america"
  },

  {
    id: "latin-america-segment-a",
    name: "Latin America — Segment A (Mexico & Central America)",
    parentId: "latin-america",
    countries: [
      "Mexico",
      "Guatemala",
      "Honduras",
      "El Salvador",
      "Nicaragua",
      "Costa Rica",
      "Panama",
      "Belize"
    ],
    defaultLanguages: [
      "es",
      "en"
    ],
    path: "/latin-america/segment-a"
  },

  {
    id: "latin-america-segment-b",
    name: "Latin America — Segment B (South America)",
    parentId: "latin-america",
    countries: [
      "Brazil",
      "Argentina",
      "Colombia",
      "Peru",
      "Chile",
      "Ecuador",
      "Bolivia",
      "Uruguay",
      "Venezuela",
      "Paraguay",
      "Guyana",
      "Suriname"
    ],
    defaultLanguages: [
      "es",
      "pt",
      "en"
    ],
    path: "/latin-america/segment-b"
  },

  // ── Caribbean ────────────────────────────────────────────────────────────

  {
    id: "caribbean",
    name: "Caribbean",
    countries: [
      "Jamaica",
      "Trinidad & Tobago",
      "Barbados",
      "Bahamas",
      "Haiti",
      "Puerto Rico",
      "Dominican Republic",
      "Cuba",
      "Guadeloupe",
      "Martinique",
      "Aruba",
      "Curaçao",
      "Saint Lucia",
      "Grenada",
      "Antigua & Barbuda"
    ],
    defaultLanguages: [
      "en",
      "es",
      "fr"
    ],
    path: "/caribbean"
  },

  // ── Africa ───────────────────────────────────────────────────────────────

  {
    id: "africa",
    name: "Africa",
    countries: [
      "Nigeria",
      "South Africa",
      "Kenya",
      "Ghana",
      "Ethiopia",
      "Tanzania",
      "Uganda",
      "Rwanda",
      "Senegal",
      "Côte d'Ivoire",
      "Cameroon",
      "Mozambique",
      "Zimbabwe",
      "Zambia",
      "Angola"
    ],
    defaultLanguages: [
      "en",
      "fr",
      "sw",
      "ar"
    ],
    path: "/africa"
  },

  // ── Middle East ──────────────────────────────────────────────────────────

  {
    id: "middle-east",
    name: "Middle East",
    countries: [
      "Saudi Arabia",
      "United Arab Emirates",
      "Qatar",
      "Kuwait",
      "Bahrain",
      "Oman",
      "Jordan",
      "Lebanon",
      "Iraq",
      "Israel",
      "Turkey",
      "Iran",
      "Egypt",
      "Libya",
      "Tunisia"
    ],
    defaultLanguages: [
      "ar",
      "en",
      "tr",
      "fa"
    ],
    path: "/middle-east"
  },

  // ── Asia-Pacific ─────────────────────────────────────────────────────────

  {
    id: "asia-pacific",
    name: "Asia-Pacific",
    countries: [
      "Japan",
      "South Korea",
      "China",
      "Australia",
      "New Zealand",
      "India",
      "Singapore",
      "Malaysia",
      "Thailand",
      "Indonesia",
      "Vietnam",
      "Philippines",
      "Hong Kong",
      "Taiwan",
      "Bangladesh"
    ],
    defaultLanguages: [
      "en",
      "zh",
      "ja",
      "ko",
      "hi",
      "id",
      "vi"
    ],
    path: "/asia-pacific"
  },

  // ── Legacy alias kept for backward compatibility ──────────────────────────

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
    ],
    path: "/asia-pacific"
  }

];
