export default function BusinessProfileAnalysis(){

const scores=[

["Leadership",74],

["Finance",69],

["Marketing",63],

["Operations",81],

["Strategy",77],

["Value Chain",58]

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Business Profile Analysis

</h2>

<div className="mt-8 space-y-5">

{scores.map(([name,value])=>(

<div key={String(name)}>

<div className="mb-2 flex justify-between">

<span className="text-white">

{name}

</span>

<span className="text-blue-400">

{value}%

</span>

</div>

<div className="h-3 rounded bg-slate-700">

<div
style={{width:`${value}%`}}
className="h-3 rounded bg-blue-500"
/>

</div>

</div>

))}

</div>

</section>

);

}
