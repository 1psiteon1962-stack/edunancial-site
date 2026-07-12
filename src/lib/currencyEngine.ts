export interface CurrencySetting{

code:string;

symbol:string;

decimals:number;

}

export const SupportedCurrencies:CurrencySetting[]=[

{code:"USD",symbol:"$",decimals:2},

{code:"CAD",symbol:"C$",decimals:2},

{code:"EUR",symbol:"€",decimals:2},

{code:"GBP",symbol:"£",decimals:2},

{code:"DOP",symbol:"RD$",decimals:2},

{code:"JMD",symbol:"J$",decimals:2},

{code:"JPY",symbol:"¥",decimals:0},

{code:"KRW",symbol:"₩",decimals:0},

{code:"CNY",symbol:"¥",decimals:2},

{code:"TWD",symbol:"NT$",decimals:0},

{code:"HKD",symbol:"HK$",decimals:2},

{code:"SGD",symbol:"S$",decimals:2},

{code:"INR",symbol:"₹",decimals:2},

{code:"AUD",symbol:"A$",decimals:2},

{code:"NZD",symbol:"NZ$",decimals:2},

{code:"PHP",symbol:"₱",decimals:2},

{code:"THB",symbol:"฿",decimals:2},

{code:"MYR",symbol:"RM",decimals:2},

{code:"IDR",symbol:"Rp",decimals:0},

{code:"VND",symbol:"₫",decimals:0}

];

export function getCurrency(code:string){

return SupportedCurrencies.find(
c=>c.code===code
);

}

export function formatCurrency(amount:number,code:string,locale?:string):string{

const currency=getCurrency(code);

if(!currency) return `${amount} ${code}`;

try{

return new Intl.NumberFormat(locale??'en',{

style:'currency',

currency:code,

minimumFractionDigits:currency.decimals,

maximumFractionDigits:currency.decimals

}).format(amount);

}catch{

return `${currency.symbol}${amount.toFixed(currency.decimals)}`;

}

}
