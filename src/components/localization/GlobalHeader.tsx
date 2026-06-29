import CountrySelector from "./CountrySelector";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";

export default function GlobalHeader(){

return(

<div className="flex flex-wrap gap-4 items-center p-4 bg-slate-900 text-white">

<CountrySelector/>

<LanguageSelector/>

<CurrencySelector/>

</div>

);

}
