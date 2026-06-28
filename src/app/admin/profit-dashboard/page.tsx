export default function ProfitDashboard(){

const cards=[

["Gross Revenue","$0"],

["Net Revenue","$0"],

["Expenses","$0"],

["Profit","$0"],

["Margin","0%"],

["Growth","0%"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Profit Dashboard

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-3">

{cards.map(([title,value])=>(

<div
key={title}
className="rounded-xl bg-slate-900 p-6">

<p className="text-slate-400">

{title}

</p>

<h2 className="text-3xl font-bold mt-3">

{value}

</h2>

</div>

))}

</div>

</main>

);

}
