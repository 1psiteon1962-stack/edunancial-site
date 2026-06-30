export default function UpcomingFeatures(){

const items=[

"AI Financial Assistant",

"Voice Conversations",

"Business KPI Dashboard",

"Funding Center",

"Investor Marketplace",

"Country Launch Controls",

"Executive Dashboard",

"Course Certificates"

];

return(

<section className="mx-auto max-w-7xl px-6 py-20">

<h2 className="text-5xl font-black text-white">

Coming Features

</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

{items.map(item=>(

<div
key={item}
className="rounded-xl bg-slate-900 border border-slate-700 p-6">

{item}

</div>

))}

</div>

</section>

);

}
