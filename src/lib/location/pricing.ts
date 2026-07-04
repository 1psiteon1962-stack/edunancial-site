export interface ProductPrice {
  id: string;
  name: string;

  amount: number;
  currency: string;
  currencySymbol: string;
}

export interface CountryPricing {
  countryId: string;

  products: ProductPrice[];
}

export const pricing: CountryPricing[] = [

  // =====================================
  // UNITED STATES
  // =====================================

  {
    countryId: "us",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 29,
        currency: "USD",
        currencySymbol: "$",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 19,
        currency: "USD",
        currencySymbol: "$",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 199,
        currency: "USD",
        currencySymbol: "$",
      },

    ],

  },

  // =====================================
  // CANADA
  // =====================================

  {
    countryId: "ca",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 39,
        currency: "CAD",
        currencySymbol: "$",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 25,
        currency: "CAD",
        currencySymbol: "$",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 249,
        currency: "CAD",
        currencySymbol: "$",
      },

    ],

  },

  // =====================================
  // UGANDA
  // =====================================

  {
    countryId: "ug",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 120000,
        currency: "UGX",
        currencySymbol: "USh",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 70000,
        currency: "UGX",
        currencySymbol: "USh",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 700000,
        currency: "UGX",
        currencySymbol: "USh",
      },

    ],

  },

  // =====================================
  // NIGERIA
  // =====================================

  {
    countryId: "ng",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 12000,
        currency: "NGN",
        currencySymbol: "₦",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 8000,
        currency: "NGN",
        currencySymbol: "₦",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 80000,
        currency: "NGN",
        currencySymbol: "₦",
      },

    ],

  },

  // =====================================
  // SOUTH AFRICA
  // =====================================

  {
    countryId: "za",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 550,
        currency: "ZAR",
        currencySymbol: "R",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 350,
        currency: "ZAR",
        currencySymbol: "R",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 3500,
        currency: "ZAR",
        currencySymbol: "R",
      },

    ],

  },

  // =====================================
  // EGYPT
  // =====================================

  {
    countryId: "eg",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 1500,
        currency: "EGP",
        currencySymbol: "E£",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 900,
        currency: "EGP",
        currencySymbol: "E£",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 9000,
        currency: "EGP",
        currencySymbol: "E£",
      },

    ],

  },

  // =====================================
  // ALGERIA
  // =====================================

  {
    countryId: "dz",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 4000,
        currency: "DZD",
        currencySymbol: "DA",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 2500,
        currency: "DZD",
        currencySymbol: "DA",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 25000,
        currency: "DZD",
        currencySymbol: "DA",
      },

    ],

  },

  // =====================================
  // MOROCCO
  // =====================================

  {
    countryId: "ma",

    products: [

      {
        id: "assessment",
        name: "Financial Competency Assessment",
        amount: 300,
        currency: "MAD",
        currencySymbol: "DH",
      },

      {
        id: "monthly",
        name: "Monthly Membership",
        amount: 200,
        currency: "MAD",
        currencySymbol: "DH",
      },

      {
        id: "annual",
        name: "Annual Membership",
        amount: 2000,
        currency: "MAD",
        currencySymbol: "DH",
      },

    ],

  },

];

export function getCountryPricing(countryId: string) {
  return pricing.find((country) => country.countryId === countryId);
}

export function getProductPrice(
  countryId: string,
  productId: string
) {
  return pricing
    .find((country) => country.countryId === countryId)
    ?.products.find((product) => product.id === productId);
}
