export interface ExchangeRate {

  code: string;

  usdRate: number;

  symbol: string;

}

export const DEFAULT_EXCHANGE_RATES: ExchangeRate[] = [

  {
    code: "USD",
    usdRate: 1,
    symbol: "$"
  },

  {
    code: "CAD",
    usdRate: 0.73,
    symbol: "C$"
  },

  {
    code: "EUR",
    usdRate: 1.17,
    symbol: "€"
  },

  {
    code: "GBP",
    usdRate: 1.35,
    symbol: "£"
  },

  {
    code: "DOP",
    usdRate: 0.017,
    symbol: "RD$"
  },

  {
    code: "UGX",
    usdRate: 0.00027,
    symbol: "USh"
  },

  {
    code: "JPY",
    usdRate: 0.0068,
    symbol: "¥"
  }

];

export function getExchangeRate(currency: string) {

  return DEFAULT_EXCHANGE_RATES.find(
    (x) => x.code === currency
  );

}
