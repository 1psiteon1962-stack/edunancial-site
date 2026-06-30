"use client";

export default function CountryRolloutControl() {

const countries=[

["United States","LIVE"],

["Canada","LIVE"],

["Uganda","Coming Soon"],

["Kenya","Coming Soon"],

["Nigeria","Coming Soon"],

["Ghana","Coming Soon"],

["Dominican Republic","Planned"],

["Puerto Rico","Planned"],

["Mexico","Planned"],

["Brazil","Planned"]

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Country Rollout Control

</h2>

<div className="mt-12 space-y-4">

{countries.map(([country,status])=>(

<div
key={country}
className="rounded-xl bg-[#111827] border border-slate-700 p-6 flex justify-between items-center">

<h3 className="text-2xl font-bold">

{country}

</h3>

<span className="font-bold">

{status}

</span>

</div>

))}

</div>

</div>

</section>

);

}
