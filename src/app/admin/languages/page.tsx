import { supportedLanguages } from "@/lib/i18n";

export default function LanguagesAdminPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white p-10">

<h1 className="text-6xl font-black">

Language Administration

</h1>

<div className="grid gap-6 mt-12 lg:grid-cols-4">

{supportedLanguages.map(language=>(

<div
key={language}
className="rounded-2xl bg-[#101a2f] border border-white/10 p-8"
>

<h2 className="text-3xl font-black">

{language.toUpperCase()}

</h2>

<p className="mt-4 text-gray-400">

Translation Active

</p>

</div>

))}

</div>

</main>

);

}
