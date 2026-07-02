export default function ExecutivePage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-7xl font-black">

Executive Center

</h1>

<p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Advanced dashboards,
business simulations,
AI coaching,
international expansion,
and executive competency.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-4">

<Box title="AI Coach"/>

<Box title="KPIs"/>

<Box title="Business Health"/>

<Box title="Executive Reports"/>

</div>

</section>

</main>

);

}

function Box({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-xl font-bold">

{title}

</h2>

</div>

);

}
