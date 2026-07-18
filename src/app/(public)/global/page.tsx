import CountrySuggestion from "@/components/localization/CountrySuggestion";
import GlobalHeader from "@/components/localization/GlobalHeader";

export default function GlobalPage(){

return(

<main className="min-h-screen">

<GlobalHeader/>

<div className="max-w-7xl mx-auto p-8">

<h1 className="text-5xl font-black">

Global Experience

</h1>

<CountrySuggestion/>

</div>

</main>

);

}
