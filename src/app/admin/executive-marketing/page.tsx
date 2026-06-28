export default function ExecutiveMarketing(){

const cards=[

["Subscribers","0"],

["Downloads","0"],

["Lead Magnets","0"],

["Revenue","$0"],

["Profit","$0"],

["LTV","$0"],

["CAC","$0"],

["ROAS","0"],

["Open Rate","0%"],

["Click Rate","0%"],

["Conversion","0%"],

["Retention","0%"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Executive Marketing Dashboard

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

{cards.map(([title,value])=>(

<div

key={title}

className="rounded-xl bg-slate-900 p-6"

>

<p className="text-slate-400">

{title}

</p>

<h2 className="mt-3 text-3xl font-bold">

{value}

</h2>

</div>

))}

</div>

</main>

);

}
