export interface Currency {

  code: string;

  symbol: string;

  decimals: number;

}

export const currencies: Currency[] = [

  {
    code: "USD",
    symbol: "$",
    decimals: 2,
  },

  {
    code: "CAD",
    symbol: "$",
    decimals: 2,
  },

  {
    code: "UGX",
    symbol: "USh",
    decimals: 0,
  },

  {
    code: "NGN",
    symbol: "₦",
    decimals: 2,
  },

  {
    code: "ZAR",
    symbol: "R",
    decimals: 2,
  },

  {
    code: "EGP",
    symbol: "E£",
    decimals: 2,
  },

  {
    code: "DZD",
    symbol: "DA",
    decimals: 2,
  },

  {
    code: "MAD",
    symbol: "DH",
    decimals: 2,
  },

];
