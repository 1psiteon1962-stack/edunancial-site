export default function ExecutiveCommandCenter(){

const cards=[

["Global Revenue","$0"],

["Global Profit","$0"],

["Global Customers","0"],

["Subscribers","0"],

["Best Region","--"],

["Best Country","--"],

["Best Product","--"],

["Highest LTV","--"],

["Lowest CAC","--"],

["Executive Alerts","0"],

["System Health","Healthy"],

["Platform Status","Online"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Executive Command Center

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

{cards.map(([title,value])=>(

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
