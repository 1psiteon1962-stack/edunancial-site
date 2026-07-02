export default function CompetencyLevels(){

const levels=[

"Explorer",

"Builder",

"Entrepreneur",

"Executive",

"Investor",

"Global Strategist"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Economic Competency Levels

</h2>

<div className="mt-8 space-y-4">

{levels.map(level=>(

<div
key={level}
className="rounded-lg bg-slate-800 p-5 text-white"
>

{level}

</div>

))}

</div>

</section>

);

}
