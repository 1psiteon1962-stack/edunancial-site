// ======================================================
// AFRICA REGIONAL FOUNDATION
// currencies.ts – Currency framework for African currencies
// ======================================================

export interface AfricaCurrency {
  code: string;
  name: string;
  symbol: string;
  /** Number of decimal places (fractional digits) */
  decimals: number;
  /** Countries using this currency (ISO-2 codes) */
  countries: string[];
}

export const AFRICA_CURRENCIES: AfricaCurrency[] = [
  // ── Individual national currencies ───────────────────
  { code: "DZD", name: "Algerian Dinar",             symbol: "دج",    decimals: 2, countries: ["DZ"] },
  { code: "EGP", name: "Egyptian Pound",             symbol: "£",     decimals: 2, countries: ["EG"] },
  { code: "LYD", name: "Libyan Dinar",               symbol: "ل.د",   decimals: 3, countries: ["LY"] },
  { code: "MAD", name: "Moroccan Dirham",            symbol: "د.م.",  decimals: 2, countries: ["MA","EH"] },
  { code: "SDG", name: "Sudanese Pound",             symbol: "ج.س.",  decimals: 2, countries: ["SD"] },
  { code: "TND", name: "Tunisian Dinar",             symbol: "د.ت",   decimals: 3, countries: ["TN"] },
  { code: "BIF", name: "Burundian Franc",            symbol: "Fr",    decimals: 0, countries: ["BI"] },
  { code: "KMF", name: "Comorian Franc",             symbol: "CF",    decimals: 0, countries: ["KM"] },
  { code: "DJF", name: "Djiboutian Franc",           symbol: "Fdj",   decimals: 0, countries: ["DJ"] },
  { code: "ERN", name: "Eritrean Nakfa",             symbol: "Nfk",   decimals: 2, countries: ["ER"] },
  { code: "ETB", name: "Ethiopian Birr",             symbol: "Br",    decimals: 2, countries: ["ET"] },
  { code: "KES", name: "Kenyan Shilling",            symbol: "KSh",   decimals: 2, countries: ["KE"] },
  { code: "MGA", name: "Malagasy Ariary",            symbol: "Ar",    decimals: 2, countries: ["MG"] },
  { code: "MWK", name: "Malawian Kwacha",            symbol: "MK",    decimals: 2, countries: ["MW"] },
  { code: "MUR", name: "Mauritian Rupee",            symbol: "₨",     decimals: 2, countries: ["MU"] },
  { code: "MZN", name: "Mozambican Metical",         symbol: "MT",    decimals: 2, countries: ["MZ"] },
  { code: "RWF", name: "Rwandan Franc",              symbol: "Fr",    decimals: 0, countries: ["RW"] },
  { code: "SCR", name: "Seychellois Rupee",          symbol: "₨",     decimals: 2, countries: ["SC"] },
  { code: "SOS", name: "Somali Shilling",            symbol: "Sh",    decimals: 2, countries: ["SO"] },
  { code: "SSP", name: "South Sudanese Pound",       symbol: "£",     decimals: 2, countries: ["SS"] },
  { code: "TZS", name: "Tanzanian Shilling",         symbol: "TSh",   decimals: 2, countries: ["TZ"] },
  { code: "UGX", name: "Ugandan Shilling",           symbol: "USh",   decimals: 0, countries: ["UG"] },
  { code: "ZMW", name: "Zambian Kwacha",             symbol: "ZK",    decimals: 2, countries: ["ZM"] },
  { code: "ZWL", name: "Zimbabwean Dollar",          symbol: "Z$",    decimals: 2, countries: ["ZW"] },
  { code: "CVE", name: "Cape Verdean Escudo",        symbol: "$",     decimals: 2, countries: ["CV"] },
  { code: "GMD", name: "Gambian Dalasi",             symbol: "D",     decimals: 2, countries: ["GM"] },
  { code: "GHS", name: "Ghanaian Cedi",              symbol: "₵",     decimals: 2, countries: ["GH"] },
  { code: "GNF", name: "Guinean Franc",              symbol: "Fr",    decimals: 0, countries: ["GN"] },
  { code: "LRD", name: "Liberian Dollar",            symbol: "$",     decimals: 2, countries: ["LR"] },
  { code: "MRU", name: "Mauritanian Ouguiya",        symbol: "UM",    decimals: 2, countries: ["MR"] },
  { code: "NGN", name: "Nigerian Naira",             symbol: "₦",     decimals: 2, countries: ["NG"] },
  { code: "SHP", name: "Saint Helena Pound",         symbol: "£",     decimals: 2, countries: ["SH"] },
  { code: "SLL", name: "Sierra Leonean Leone",       symbol: "Le",    decimals: 2, countries: ["SL"] },
  { code: "AOA", name: "Angolan Kwanza",             symbol: "Kz",    decimals: 2, countries: ["AO"] },
  { code: "CDF", name: "Congolese Franc",            symbol: "Fr",    decimals: 2, countries: ["CD"] },
  { code: "STN", name: "São Tomé and Príncipe Dobra",symbol: "Db",    decimals: 2, countries: ["ST"] },
  { code: "BWP", name: "Botswana Pula",              symbol: "P",     decimals: 2, countries: ["BW"] },
  { code: "SZL", name: "Swazi Lilangeni",            symbol: "L",     decimals: 2, countries: ["SZ"] },
  { code: "LSL", name: "Lesotho Loti",               symbol: "L",     decimals: 2, countries: ["LS"] },
  { code: "NAD", name: "Namibian Dollar",            symbol: "$",     decimals: 2, countries: ["NA"] },
  { code: "ZAR", name: "South African Rand",         symbol: "R",     decimals: 2, countries: ["ZA"] },
  // ── Regional / shared currencies ─────────────────────
  { code: "XOF", name: "West African CFA Franc",     symbol: "Fr",    decimals: 0, countries: ["BJ","BF","CI","GW","ML","NE","SN","TG"] },
  { code: "XAF", name: "Central African CFA Franc",  symbol: "Fr",    decimals: 0, countries: ["CM","CF","TD","CG","GQ","GA"] },
  // Euro territories
  { code: "EUR", name: "Euro",                       symbol: "€",     decimals: 2, countries: ["RE"] },
];

/** Look up a currency by its ISO code. */
export function getAfricaCurrency(code: string): AfricaCurrency | undefined {
  return AFRICA_CURRENCIES.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
}

/** Return the currency for a given country ISO-2 code. */
export function getCurrencyForCountry(
  countryIso: string
): AfricaCurrency | undefined {
  return AFRICA_CURRENCIES.find((c) =>
    c.countries.includes(countryIso.toUpperCase())
  );
}
