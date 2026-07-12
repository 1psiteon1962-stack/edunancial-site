export type ProvinceTaxModel = "hst" | "gst+pst" | "gst+qst" | "gst-only";

export interface ProvinceTaxConfig {
  gstRate: number;
  provincialRate: number;
  totalRate: number;
  taxModel: ProvinceTaxModel;
  taxLabel: string;
}

export interface CanadianProvinceConfig {
  code: string;
  name: string;
  nameFr: string;
  type: "province" | "territory";
  capital: string;
  timezone: string;
  languages: string[];
  tax: ProvinceTaxConfig;
}

export const CANADIAN_PROVINCES: CanadianProvinceConfig[] = [
  {
    code: "AB",
    name: "Alberta",
    nameFr: "Alberta",
    type: "province",
    capital: "Edmonton",
    timezone: "America/Edmonton",
    languages: ["en"],
    tax: {
      gstRate: 5,
      provincialRate: 0,
      totalRate: 5,
      taxModel: "gst-only",
      taxLabel: "GST",
    },
  },
  {
    code: "BC",
    name: "British Columbia",
    nameFr: "Colombie-Britannique",
    type: "province",
    capital: "Victoria",
    timezone: "America/Vancouver",
    languages: ["en"],
    tax: {
      gstRate: 5,
      provincialRate: 7,
      totalRate: 12,
      taxModel: "gst+pst",
      taxLabel: "GST + PST",
    },
  },
  {
    code: "MB",
    name: "Manitoba",
    nameFr: "Manitoba",
    type: "province",
    capital: "Winnipeg",
    timezone: "America/Winnipeg",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 7,
      totalRate: 12,
      taxModel: "gst+pst",
      taxLabel: "GST + RST",
    },
  },
  {
    code: "NB",
    name: "New Brunswick",
    nameFr: "Nouveau-Brunswick",
    type: "province",
    capital: "Fredericton",
    timezone: "America/Moncton",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 10,
      totalRate: 15,
      taxModel: "hst",
      taxLabel: "HST",
    },
  },
  {
    code: "NL",
    name: "Newfoundland and Labrador",
    nameFr: "Terre-Neuve-et-Labrador",
    type: "province",
    capital: "St. John's",
    timezone: "America/St_Johns",
    languages: ["en"],
    tax: {
      gstRate: 5,
      provincialRate: 10,
      totalRate: 15,
      taxModel: "hst",
      taxLabel: "HST",
    },
  },
  {
    code: "NS",
    name: "Nova Scotia",
    nameFr: "Nouvelle-Écosse",
    type: "province",
    capital: "Halifax",
    timezone: "America/Halifax",
    languages: ["en"],
    tax: {
      gstRate: 5,
      provincialRate: 10,
      totalRate: 15,
      taxModel: "hst",
      taxLabel: "HST",
    },
  },
  {
    code: "NT",
    name: "Northwest Territories",
    nameFr: "Territoires du Nord-Ouest",
    type: "territory",
    capital: "Yellowknife",
    timezone: "America/Yellowknife",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 0,
      totalRate: 5,
      taxModel: "gst-only",
      taxLabel: "GST",
    },
  },
  {
    code: "NU",
    name: "Nunavut",
    nameFr: "Nunavut",
    type: "territory",
    capital: "Iqaluit",
    timezone: "America/Iqaluit",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 0,
      totalRate: 5,
      taxModel: "gst-only",
      taxLabel: "GST",
    },
  },
  {
    code: "ON",
    name: "Ontario",
    nameFr: "Ontario",
    type: "province",
    capital: "Toronto",
    timezone: "America/Toronto",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 8,
      totalRate: 13,
      taxModel: "hst",
      taxLabel: "HST",
    },
  },
  {
    code: "PE",
    name: "Prince Edward Island",
    nameFr: "Île-du-Prince-Édouard",
    type: "province",
    capital: "Charlottetown",
    timezone: "America/Halifax",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 10,
      totalRate: 15,
      taxModel: "hst",
      taxLabel: "HST",
    },
  },
  {
    code: "QC",
    name: "Quebec",
    nameFr: "Québec",
    type: "province",
    capital: "Quebec City",
    timezone: "America/Montreal",
    languages: ["fr", "en"],
    tax: {
      gstRate: 5,
      provincialRate: 9.975,
      totalRate: 14.975,
      taxModel: "gst+qst",
      taxLabel: "GST + QST",
    },
  },
  {
    code: "SK",
    name: "Saskatchewan",
    nameFr: "Saskatchewan",
    type: "province",
    capital: "Regina",
    timezone: "America/Regina",
    languages: ["en"],
    tax: {
      gstRate: 5,
      provincialRate: 6,
      totalRate: 11,
      taxModel: "gst+pst",
      taxLabel: "GST + PST",
    },
  },
  {
    code: "YT",
    name: "Yukon",
    nameFr: "Yukon",
    type: "territory",
    capital: "Whitehorse",
    timezone: "America/Whitehorse",
    languages: ["en", "fr"],
    tax: {
      gstRate: 5,
      provincialRate: 0,
      totalRate: 5,
      taxModel: "gst-only",
      taxLabel: "GST",
    },
  },
];

export function getProvinceByCode(
  code: string
): CanadianProvinceConfig | undefined {
  return CANADIAN_PROVINCES.find(
    (p) => p.code === code.toUpperCase()
  );
}

export function getProvinceTax(
  provinceCode: string
): ProvinceTaxConfig | undefined {
  return getProvinceByCode(provinceCode)?.tax;
}

export function isQuebec(provinceCode: string): boolean {
  return provinceCode.toUpperCase() === "QC";
}

export function getDefaultLanguageForProvince(
  provinceCode: string
): string {
  const province = getProvinceByCode(provinceCode);
  return province?.languages[0] ?? "en";
}
