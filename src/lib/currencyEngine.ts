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

{code:"JPY",symbol:"¥",decimals:0}

];

export function getCurrency(code:string){

return SupportedCurrencies.find(
c=>c.code===code
);

}
