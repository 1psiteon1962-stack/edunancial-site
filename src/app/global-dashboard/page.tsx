export default function GlobalDashboardPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-6xl font-black">

Global Competency Dashboard

</h1>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Measure competency across individuals,
families,
schools,
businesses,
communities,
and countries.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-5">

<Tile title="Students"/>

<Tile title="Families"/>

<Tile title="Schools"/>

<Tile title="Businesses"/>

<Tile title="Countries"/>

</div>

</section>

</main>

);

}

function Tile({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8 text-center">

<h2 className="text-xl font-bold">

{title}

</h2>

<p className="mt-6 text-4xl font-black text-blue-500">

0%

</p>

</div>

);

}
