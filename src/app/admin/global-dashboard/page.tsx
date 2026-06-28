export default function GlobalDashboard(){

const cards=[

["Revenue","$0"],

["Profit","$0"],

["Expenses","$0"],

["Subscribers","0"],

["Customers","0"],

["Books","0"],

["Courses","0"],

["Memberships","0"],

["LTV","$0"],

["CAC","$0"],

["ROAS","0"],

["Conversion","0%"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Global Executive Dashboard

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

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
