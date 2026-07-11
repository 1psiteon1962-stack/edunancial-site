// ======================================================
// AFRICA REGIONAL FOUNDATION
// countries.ts – Country registry for all African nations
// ======================================================

export interface AfricaCountry {
  /** ISO 3166-1 alpha-2 code */
  isoCode: string;
  /** ISO 3166-1 alpha-3 code */
  isoCode3: string;
  name: string;
  officialLanguages: string[];
  currency: string;
  currencyCode: string;
  timezone: string[];
  subRegion: AfricaSubRegion;
  /** Active in the platform; false = configured but not yet launched */
  active: boolean;
}

export type AfricaSubRegion =
  | "northern-africa"
  | "eastern-africa"
  | "western-africa"
  | "central-africa"
  | "southern-africa";

export const AFRICA_COUNTRIES: AfricaCountry[] = [
  // ── Northern Africa ──────────────────────────────────
  { isoCode: "DZ", isoCode3: "DZA", name: "Algeria",        officialLanguages: ["ar","fr"],     currency: "Algerian Dinar",        currencyCode: "DZD", timezone: ["Africa/Algiers"],      subRegion: "northern-africa", active: false },
  { isoCode: "EG", isoCode3: "EGY", name: "Egypt",          officialLanguages: ["ar"],          currency: "Egyptian Pound",        currencyCode: "EGP", timezone: ["Africa/Cairo"],        subRegion: "northern-africa", active: false },
  { isoCode: "LY", isoCode3: "LBY", name: "Libya",          officialLanguages: ["ar"],          currency: "Libyan Dinar",          currencyCode: "LYD", timezone: ["Africa/Tripoli"],      subRegion: "northern-africa", active: false },
  { isoCode: "MA", isoCode3: "MAR", name: "Morocco",        officialLanguages: ["ar","fr"],     currency: "Moroccan Dirham",       currencyCode: "MAD", timezone: ["Africa/Casablanca"],   subRegion: "northern-africa", active: false },
  { isoCode: "SD", isoCode3: "SDN", name: "Sudan",          officialLanguages: ["ar","en"],     currency: "Sudanese Pound",        currencyCode: "SDG", timezone: ["Africa/Khartoum"],     subRegion: "northern-africa", active: false },
  { isoCode: "TN", isoCode3: "TUN", name: "Tunisia",        officialLanguages: ["ar","fr"],     currency: "Tunisian Dinar",        currencyCode: "TND", timezone: ["Africa/Tunis"],        subRegion: "northern-africa", active: false },
  { isoCode: "EH", isoCode3: "ESH", name: "Western Sahara", officialLanguages: ["ar","es","fr"],currency: "Moroccan Dirham",       currencyCode: "MAD", timezone: ["Africa/El_Aaiun"],     subRegion: "northern-africa", active: false },

  // ── Eastern Africa ───────────────────────────────────
  { isoCode: "BI", isoCode3: "BDI", name: "Burundi",             officialLanguages: ["fr","rn","en"],  currency: "Burundian Franc",   currencyCode: "BIF", timezone: ["Africa/Bujumbura"],      subRegion: "eastern-africa", active: false },
  { isoCode: "KM", isoCode3: "COM", name: "Comoros",             officialLanguages: ["ar","fr","sw"],  currency: "Comorian Franc",    currencyCode: "KMF", timezone: ["Indian/Comoro"],          subRegion: "eastern-africa", active: false },
  { isoCode: "DJ", isoCode3: "DJI", name: "Djibouti",            officialLanguages: ["fr","ar"],       currency: "Djiboutian Franc",  currencyCode: "DJF", timezone: ["Africa/Djibouti"],        subRegion: "eastern-africa", active: false },
  { isoCode: "ER", isoCode3: "ERI", name: "Eritrea",             officialLanguages: ["ti","ar","en"],  currency: "Eritrean Nakfa",    currencyCode: "ERN", timezone: ["Africa/Asmara"],          subRegion: "eastern-africa", active: false },
  { isoCode: "ET", isoCode3: "ETH", name: "Ethiopia",            officialLanguages: ["am"],            currency: "Ethiopian Birr",    currencyCode: "ETB", timezone: ["Africa/Addis_Ababa"],     subRegion: "eastern-africa", active: false },
  { isoCode: "KE", isoCode3: "KEN", name: "Kenya",               officialLanguages: ["sw","en"],       currency: "Kenyan Shilling",   currencyCode: "KES", timezone: ["Africa/Nairobi"],         subRegion: "eastern-africa", active: false },
  { isoCode: "MG", isoCode3: "MDG", name: "Madagascar",          officialLanguages: ["mg","fr"],       currency: "Malagasy Ariary",   currencyCode: "MGA", timezone: ["Indian/Antananarivo"],    subRegion: "eastern-africa", active: false },
  { isoCode: "MW", isoCode3: "MWI", name: "Malawi",              officialLanguages: ["en","ny"],       currency: "Malawian Kwacha",   currencyCode: "MWK", timezone: ["Africa/Blantyre"],        subRegion: "eastern-africa", active: false },
  { isoCode: "MU", isoCode3: "MUS", name: "Mauritius",           officialLanguages: ["en","fr"],       currency: "Mauritian Rupee",   currencyCode: "MUR", timezone: ["Indian/Mauritius"],       subRegion: "eastern-africa", active: false },
  { isoCode: "MZ", isoCode3: "MOZ", name: "Mozambique",          officialLanguages: ["pt"],            currency: "Mozambican Metical",currencyCode: "MZN", timezone: ["Africa/Maputo"],          subRegion: "eastern-africa", active: false },
  { isoCode: "RW", isoCode3: "RWA", name: "Rwanda",              officialLanguages: ["rw","fr","en"],  currency: "Rwandan Franc",     currencyCode: "RWF", timezone: ["Africa/Kigali"],          subRegion: "eastern-africa", active: false },
  { isoCode: "RE", isoCode3: "REU", name: "Réunion",             officialLanguages: ["fr"],            currency: "Euro",              currencyCode: "EUR", timezone: ["Indian/Reunion"],          subRegion: "eastern-africa", active: false },
  { isoCode: "SC", isoCode3: "SYC", name: "Seychelles",          officialLanguages: ["en","fr","crs"], currency: "Seychellois Rupee", currencyCode: "SCR", timezone: ["Indian/Mahe"],            subRegion: "eastern-africa", active: false },
  { isoCode: "SO", isoCode3: "SOM", name: "Somalia",             officialLanguages: ["so","ar"],       currency: "Somali Shilling",   currencyCode: "SOS", timezone: ["Africa/Mogadishu"],       subRegion: "eastern-africa", active: false },
  { isoCode: "SS", isoCode3: "SSD", name: "South Sudan",         officialLanguages: ["en"],            currency: "South Sudanese Pound",currencyCode:"SSP", timezone: ["Africa/Juba"],           subRegion: "eastern-africa", active: false },
  { isoCode: "TZ", isoCode3: "TZA", name: "Tanzania",            officialLanguages: ["sw","en"],       currency: "Tanzanian Shilling",currencyCode: "TZS", timezone: ["Africa/Dar_es_Salaam"],  subRegion: "eastern-africa", active: false },
  { isoCode: "UG", isoCode3: "UGA", name: "Uganda",              officialLanguages: ["en","sw"],       currency: "Ugandan Shilling",  currencyCode: "UGX", timezone: ["Africa/Kampala"],         subRegion: "eastern-africa", active: false },
  { isoCode: "ZM", isoCode3: "ZMB", name: "Zambia",              officialLanguages: ["en"],            currency: "Zambian Kwacha",    currencyCode: "ZMW", timezone: ["Africa/Lusaka"],          subRegion: "eastern-africa", active: false },
  { isoCode: "ZW", isoCode3: "ZWE", name: "Zimbabwe",            officialLanguages: ["en","sn","nd"],  currency: "Zimbabwean Dollar", currencyCode: "ZWL", timezone: ["Africa/Harare"],          subRegion: "eastern-africa", active: false },

  // ── Western Africa ───────────────────────────────────
  { isoCode: "BJ", isoCode3: "BEN", name: "Benin",               officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Porto-Novo"],   subRegion: "western-africa", active: false },
  { isoCode: "BF", isoCode3: "BFA", name: "Burkina Faso",        officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Ouagadougou"], subRegion: "western-africa", active: false },
  { isoCode: "CV", isoCode3: "CPV", name: "Cape Verde",          officialLanguages: ["pt"],       currency: "Cape Verdean Escudo",   currencyCode: "CVE", timezone: ["Atlantic/Cape_Verde"],subRegion: "western-africa", active: false },
  { isoCode: "CI", isoCode3: "CIV", name: "Côte d'Ivoire",      officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Abidjan"],     subRegion: "western-africa", active: false },
  { isoCode: "GM", isoCode3: "GMB", name: "Gambia",              officialLanguages: ["en"],       currency: "Gambian Dalasi",        currencyCode: "GMD", timezone: ["Africa/Banjul"],      subRegion: "western-africa", active: false },
  { isoCode: "GH", isoCode3: "GHA", name: "Ghana",               officialLanguages: ["en"],       currency: "Ghanaian Cedi",         currencyCode: "GHS", timezone: ["Africa/Accra"],       subRegion: "western-africa", active: false },
  { isoCode: "GN", isoCode3: "GIN", name: "Guinea",              officialLanguages: ["fr"],       currency: "Guinean Franc",         currencyCode: "GNF", timezone: ["Africa/Conakry"],     subRegion: "western-africa", active: false },
  { isoCode: "GW", isoCode3: "GNB", name: "Guinea-Bissau",       officialLanguages: ["pt"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Bissau"],      subRegion: "western-africa", active: false },
  { isoCode: "LR", isoCode3: "LBR", name: "Liberia",             officialLanguages: ["en"],       currency: "Liberian Dollar",       currencyCode: "LRD", timezone: ["Africa/Monrovia"],    subRegion: "western-africa", active: false },
  { isoCode: "ML", isoCode3: "MLI", name: "Mali",                officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Bamako"],      subRegion: "western-africa", active: false },
  { isoCode: "MR", isoCode3: "MRT", name: "Mauritania",          officialLanguages: ["ar"],       currency: "Mauritanian Ouguiya",   currencyCode: "MRU", timezone: ["Africa/Nouakchott"],  subRegion: "western-africa", active: false },
  { isoCode: "NE", isoCode3: "NER", name: "Niger",               officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Niamey"],      subRegion: "western-africa", active: false },
  { isoCode: "NG", isoCode3: "NGA", name: "Nigeria",             officialLanguages: ["en"],       currency: "Nigerian Naira",        currencyCode: "NGN", timezone: ["Africa/Lagos"],       subRegion: "western-africa", active: false },
  { isoCode: "SH", isoCode3: "SHN", name: "Saint Helena",        officialLanguages: ["en"],       currency: "Saint Helena Pound",    currencyCode: "SHP", timezone: ["Atlantic/St_Helena"],  subRegion: "western-africa", active: false },
  { isoCode: "SN", isoCode3: "SEN", name: "Senegal",             officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Dakar"],       subRegion: "western-africa", active: false },
  { isoCode: "SL", isoCode3: "SLE", name: "Sierra Leone",        officialLanguages: ["en"],       currency: "Sierra Leonean Leone",  currencyCode: "SLL", timezone: ["Africa/Freetown"],    subRegion: "western-africa", active: false },
  { isoCode: "TG", isoCode3: "TGO", name: "Togo",                officialLanguages: ["fr"],       currency: "West African CFA Franc",currencyCode: "XOF", timezone: ["Africa/Lome"],        subRegion: "western-africa", active: false },

  // ── Central Africa ───────────────────────────────────
  { isoCode: "AO", isoCode3: "AGO", name: "Angola",                     officialLanguages: ["pt"],       currency: "Angolan Kwanza",          currencyCode: "AOA", timezone: ["Africa/Luanda"],      subRegion: "central-africa", active: false },
  { isoCode: "CM", isoCode3: "CMR", name: "Cameroon",                   officialLanguages: ["fr","en"],  currency: "Central African CFA Franc",currencyCode:"XAF", timezone: ["Africa/Douala"],     subRegion: "central-africa", active: false },
  { isoCode: "CF", isoCode3: "CAF", name: "Central African Republic",   officialLanguages: ["fr","sg"],  currency: "Central African CFA Franc",currencyCode:"XAF", timezone: ["Africa/Bangui"],     subRegion: "central-africa", active: false },
  { isoCode: "TD", isoCode3: "TCD", name: "Chad",                       officialLanguages: ["fr","ar"],  currency: "Central African CFA Franc",currencyCode:"XAF", timezone: ["Africa/Ndjamena"],   subRegion: "central-africa", active: false },
  { isoCode: "CG", isoCode3: "COG", name: "Republic of the Congo",      officialLanguages: ["fr"],       currency: "Central African CFA Franc",currencyCode:"XAF", timezone: ["Africa/Brazzaville"],subRegion: "central-africa", active: false },
  { isoCode: "CD", isoCode3: "COD", name: "DR Congo",                   officialLanguages: ["fr"],       currency: "Congolese Franc",          currencyCode: "CDF", timezone: ["Africa/Kinshasa"],   subRegion: "central-africa", active: false },
  { isoCode: "GQ", isoCode3: "GNQ", name: "Equatorial Guinea",          officialLanguages: ["es","fr","pt"],currency:"Central African CFA Franc",currencyCode:"XAF",timezone: ["Africa/Malabo"],     subRegion: "central-africa", active: false },
  { isoCode: "GA", isoCode3: "GAB", name: "Gabon",                      officialLanguages: ["fr"],       currency: "Central African CFA Franc",currencyCode:"XAF", timezone: ["Africa/Libreville"], subRegion: "central-africa", active: false },
  { isoCode: "ST", isoCode3: "STP", name: "São Tomé and Príncipe",      officialLanguages: ["pt"],       currency: "São Tomé and Príncipe Dobra",currencyCode:"STN",timezone: ["Africa/Sao_Tome"],  subRegion: "central-africa", active: false },

  // ── Southern Africa ──────────────────────────────────
  { isoCode: "BW", isoCode3: "BWA", name: "Botswana",     officialLanguages: ["en","tn"],   currency: "Botswana Pula",          currencyCode: "BWP", timezone: ["Africa/Gaborone"],    subRegion: "southern-africa", active: false },
  { isoCode: "SZ", isoCode3: "SWZ", name: "Eswatini",     officialLanguages: ["en","ss"],   currency: "Swazi Lilangeni",        currencyCode: "SZL", timezone: ["Africa/Mbabane"],     subRegion: "southern-africa", active: false },
  { isoCode: "LS", isoCode3: "LSO", name: "Lesotho",      officialLanguages: ["st","en"],   currency: "Lesotho Loti",           currencyCode: "LSL", timezone: ["Africa/Maseru"],      subRegion: "southern-africa", active: false },
  { isoCode: "NA", isoCode3: "NAM", name: "Namibia",      officialLanguages: ["en"],        currency: "Namibian Dollar",        currencyCode: "NAD", timezone: ["Africa/Windhoek"],    subRegion: "southern-africa", active: false },
  { isoCode: "ZA", isoCode3: "ZAF", name: "South Africa", officialLanguages: ["en","af","zu","xh","st","tn","ts","ss","ve","nr","nso"], currency: "South African Rand", currencyCode: "ZAR", timezone: ["Africa/Johannesburg"], subRegion: "southern-africa", active: false },
];

/** All ISO codes for Africa (used for routing/detection). */
export const AFRICA_ISO_CODES: string[] = AFRICA_COUNTRIES.map((c) => c.isoCode);

/** Look up a country by ISO-2 code. */
export function getAfricaCountry(isoCode: string): AfricaCountry | undefined {
  return AFRICA_COUNTRIES.find(
    (c) => c.isoCode.toLowerCase() === isoCode.toLowerCase()
  );
}

/** Countries grouped by sub-region. */
export function getAfricaCountriesBySubRegion(
  subRegion: AfricaSubRegion
): AfricaCountry[] {
  return AFRICA_COUNTRIES.filter((c) => c.subRegion === subRegion);
}
