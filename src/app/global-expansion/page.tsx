import GlobalExpansionDashboard from "@/components/localization/GlobalExpansionDashboard";

export default function GlobalExpansionPage(){

return(

<main className="min-h-screen bg-slate-100">

<div className="max-w-7xl mx-auto p-10">

<h1 className="text-5xl font-black">

Global Expansion Center

</h1>

<p className="mt-6 text-lg">

Manage every country's localization, pricing, AI configuration, marketplace and payment settings from one place.

</p>

<GlobalExpansionDashboard/>

</div>

</main>

);

}
