export default function AIRecommendations(){

const recommendations=[

"Know Your Numbers",

"Cash Flow Mastery",

"Distribution Systems",

"Value Chain Strategy",

"Executive KPI Dashboard",

"International Expansion"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

AI Recommended Learning

</h2>

<div className="mt-8 space-y-4">

{recommendations.map(item=>(

<div
key={item}
className="rounded-lg bg-slate-800 p-4 text-white"
>

{item}

</div>

))}

</div>

</section>

);

}
