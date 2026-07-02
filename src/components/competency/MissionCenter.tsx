export default function MissionCenter() {

const missions=[
"Create your first budget",
"Calculate your net worth",
"Track expenses for 30 days",
"Open an investment account",
"Write a simple business plan",
"Analyze a real company"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-4xl font-black text-white">

Mission Center

</h2>

<p className="mt-4 text-slate-300">

Competency is earned by completing real-world missions.

</p>

<div className="mt-8 space-y-4">

{missions.map(mission=>(

<div
key={mission}
className="rounded-lg bg-slate-800 p-5 text-white"
>

✓ {mission}

</div>

))}

</div>

</section>

);

}
