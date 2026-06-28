export default function RegionalDashboard(){

const regions=[
"North America",
"Caribbean",
"Latin America",
"Europe",
"Africa",
"Middle East",
"Asia",
"Oceania"
];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Regional Executive Dashboard

</h1>

<div className="grid gap-5 mt-10">

{regions.map(region=>(

<div
key={region}
className="rounded-xl bg-slate-900 p-6 flex justify-between">

<h2>{region}</h2>

<span>$0.00</span>

</div>

))}

</div>

</main>

);

}
