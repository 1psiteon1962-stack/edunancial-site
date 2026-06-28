export default function ExecutiveSummary(){

const metrics=[

["Global Revenue","$0"],

["Global Profit","$0"],

["Global Margin","0%"],

["Customers","0"],

["Subscribers","0"],

["LTV","$0"],

["CAC","$0"],

["ROAS","0"],

["Growth","0%"],

["Alerts","0"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Executive Summary

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-5">

{metrics.map(([title,value])=>(

<div
key={title}
className="rounded-xl bg-slate-900 p-6">

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
