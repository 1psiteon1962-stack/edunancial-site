export default function MissionPage() {

const missions=[

"Track expenses",

"Prepare a budget",

"Analyze one stock",

"Compare two mortgages",

"Interview a business owner",

"Prepare a cash flow statement"

];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-6xl font-black">

Mission Center

</h1>

<div className="mt-16 space-y-5">

{missions.map(mission=>(

<div
key={mission}
className="rounded-xl bg-slate-900 p-6 text-xl"
>

✓ {mission}

</div>

))}

</div>

</section>

</main>

);

}
