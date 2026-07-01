"use client";

const countries=[
"United States",
"Canada",
"Mexico",
"Puerto Rico",
"Dominican Republic",
"Uganda",
"Kenya",
"Nigeria",
"Ghana",
"South Africa",
"United Kingdom",
"Spain"
];

export default function CountryConfigurationDashboard(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Country Configuration

</h1>

<p className="mt-4 text-gray-400">

Global Principles. Local Application.

</p>

<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">

{countries.map(country=>(

<div
key={country}
className="rounded-xl bg-slate-900 border border-slate-700 p-6">

<h2 className="text-2xl font-bold">

{country}

</h2>

<p className="mt-4 text-gray-400">

Configure

</p>

</div>

))}

</div>

</section>

</main>

);

}
