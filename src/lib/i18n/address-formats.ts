export type AddressField = {
  name:
    | "recipient"
    | "organization"
    | "addressLine1"
    | "addressLine2"
    | "building"
    | "district"
    | "city"
    | "state"
    | "province"
    | "prefecture"
    | "postalCode"
    | "country";
  label: string;
  required: boolean;
  autoComplete?: string;
};

export type AddressFormat = {
  locale: string;
  countryCode: string;
  fields: AddressField[];
  localityLabel: string;
  administrativeAreaLabel: string;
  postalCodeLabel: string;
  postalCodeBeforeCity: boolean;
};

const addressFormats: Record<string, AddressFormat> = {
  us: {
    locale: "en-US",
    countryCode: "US",
    fields: [
      { name: "recipient", label: "Full name", required: true, autoComplete: "name" },
      { name: "organization", label: "Company", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Street address", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Apartment, suite, etc.", required: false, autoComplete: "address-line2" },
      { name: "city", label: "City", required: true, autoComplete: "address-level2" },
      { name: "state", label: "State", required: true, autoComplete: "address-level1" },
      { name: "postalCode", label: "ZIP code", required: true, autoComplete: "postal-code" },
      { name: "country", label: "Country", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "City",
    administrativeAreaLabel: "State",
    postalCodeLabel: "ZIP code",
    postalCodeBeforeCity: false,
  },
  uk: {
    locale: "en-GB",
    countryCode: "GB",
    fields: [
      { name: "recipient", label: "Full name", required: true, autoComplete: "name" },
      { name: "organization", label: "Company", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Address line 1", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Address line 2", required: false, autoComplete: "address-line2" },
      { name: "city", label: "Town or city", required: true, autoComplete: "address-level2" },
      { name: "state", label: "County", required: false, autoComplete: "address-level1" },
      { name: "postalCode", label: "Postcode", required: true, autoComplete: "postal-code" },
      { name: "country", label: "Country", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Town or city",
    administrativeAreaLabel: "County",
    postalCodeLabel: "Postcode",
    postalCodeBeforeCity: false,
  },
  de: {
    locale: "de-DE",
    countryCode: "DE",
    fields: [
      { name: "recipient", label: "Name", required: true, autoComplete: "name" },
      { name: "organization", label: "Unternehmen", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Straße und Hausnummer", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Adresszusatz", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "Postleitzahl", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Ort", required: true, autoComplete: "address-level2" },
      { name: "country", label: "Land", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Ort",
    administrativeAreaLabel: "Bundesland",
    postalCodeLabel: "Postleitzahl",
    postalCodeBeforeCity: true,
  },
  fr: {
    locale: "fr-FR",
    countryCode: "FR",
    fields: [
      { name: "recipient", label: "Nom complet", required: true, autoComplete: "name" },
      { name: "organization", label: "Société", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Adresse", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Complément d’adresse", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "Code postal", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Ville", required: true, autoComplete: "address-level2" },
      { name: "country", label: "Pays", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Ville",
    administrativeAreaLabel: "Région",
    postalCodeLabel: "Code postal",
    postalCodeBeforeCity: true,
  },
  es: {
    locale: "es-ES",
    countryCode: "ES",
    fields: [
      { name: "recipient", label: "Nombre completo", required: true, autoComplete: "name" },
      { name: "organization", label: "Empresa", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Dirección", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Piso, puerta, etc.", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "Código postal", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Ciudad", required: true, autoComplete: "address-level2" },
      { name: "province", label: "Provincia", required: true, autoComplete: "address-level1" },
      { name: "country", label: "País", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Ciudad",
    administrativeAreaLabel: "Provincia",
    postalCodeLabel: "Código postal",
    postalCodeBeforeCity: true,
  },
  pt: {
    locale: "pt-PT",
    countryCode: "PT",
    fields: [
      { name: "recipient", label: "Nome completo", required: true, autoComplete: "name" },
      { name: "organization", label: "Empresa", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Morada", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Complemento de morada", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "Código postal", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Localidade", required: true, autoComplete: "address-level2" },
      { name: "country", label: "País", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Localidade",
    administrativeAreaLabel: "Distrito",
    postalCodeLabel: "Código postal",
    postalCodeBeforeCity: true,
  },
  it: {
    locale: "it-IT",
    countryCode: "IT",
    fields: [
      { name: "recipient", label: "Nome completo", required: true, autoComplete: "name" },
      { name: "organization", label: "Azienda", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Indirizzo", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Interno, scala, ecc.", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "CAP", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Città", required: true, autoComplete: "address-level2" },
      { name: "province", label: "Provincia", required: true, autoComplete: "address-level1" },
      { name: "country", label: "Paese", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Città",
    administrativeAreaLabel: "Provincia",
    postalCodeLabel: "CAP",
    postalCodeBeforeCity: true,
  },
  nl: {
    locale: "nl-NL",
    countryCode: "NL",
    fields: [
      { name: "recipient", label: "Volledige naam", required: true, autoComplete: "name" },
      { name: "organization", label: "Bedrijf", required: false, autoComplete: "organization" },
      { name: "addressLine1", label: "Straat en huisnummer", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "Toevoeging", required: false, autoComplete: "address-line2" },
      { name: "postalCode", label: "Postcode", required: true, autoComplete: "postal-code" },
      { name: "city", label: "Plaats", required: true, autoComplete: "address-level2" },
      { name: "country", label: "Land", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "Plaats",
    administrativeAreaLabel: "Provincie",
    postalCodeLabel: "Postcode",
    postalCodeBeforeCity: true,
  },
  jp: {
    locale: "ja-JP",
    countryCode: "JP",
    fields: [
      { name: "postalCode", label: "郵便番号", required: true, autoComplete: "postal-code" },
      { name: "prefecture", label: "都道府県", required: true, autoComplete: "address-level1" },
      { name: "city", label: "市区町村", required: true, autoComplete: "address-level2" },
      { name: "addressLine1", label: "町名・番地", required: true, autoComplete: "address-line1" },
      { name: "building", label: "建物名・部屋番号", required: false, autoComplete: "address-line2" },
      { name: "recipient", label: "氏名", required: true, autoComplete: "name" },
      { name: "country", label: "国", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "市区町村",
    administrativeAreaLabel: "都道府県",
    postalCodeLabel: "郵便番号",
    postalCodeBeforeCity: true,
  },
  kr: {
    locale: "ko-KR",
    countryCode: "KR",
    fields: [
      { name: "postalCode", label: "우편번호", required: true, autoComplete: "postal-code" },
      { name: "state", label: "시/도", required: true, autoComplete: "address-level1" },
      { name: "city", label: "시/군/구", required: true, autoComplete: "address-level2" },
      { name: "addressLine1", label: "도로명 주소", required: true, autoComplete: "address-line1" },
      { name: "addressLine2", label: "상세 주소", required: false, autoComplete: "address-line2" },
      { name: "recipient", label: "받는 사람", required: true, autoComplete: "name" },
      { name: "country", label: "국가", required: true, autoComplete: "country-name" },
    ],
    localityLabel: "시/군/구",
    administrativeAreaLabel: "시/도",
    postalCodeLabel: "우편번호",
    postalCodeBeforeCity: true,
  },
};

export function getAddressFormat(locale: string): AddressFormat {
  const normalized = locale.toLowerCase();
  if (normalized === "en-gb") {
    return addressFormats.uk;
  }
  if (normalized === "ja" || normalized === "ja-jp") {
    return addressFormats.jp;
  }
  if (normalized === "ko" || normalized === "ko-kr") {
    return addressFormats.kr;
  }

  const language = normalized.split(/[-_]/)[0];
  return (
    addressFormats[normalized] ??
    addressFormats[language] ??
    addressFormats.us
  );
}
