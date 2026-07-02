export default function CorporateTrainingPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-6xl font-black">

Corporate Training

</h1>

<p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Provide financial competency,
entrepreneurship,
leadership,
and business education to your workforce through customized learning paths.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-3">

<Box title="Employee Learning"/>

<Box title="Leadership Development"/>

<Box title="Executive Programs"/>

</div>

</section>

</main>

);

}

function Box({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-2xl font-black">

{title}

</h2>

</div>

);

}
