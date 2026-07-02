export default function CompetencyPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-7xl font-black">

Financial Competency

</h1>

<p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Financial literacy provides the foundation.

Financial competency is built through disciplined action.

Economic competency is demonstrated by consistently making sound financial and business decisions.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-3">

<div className="rounded-xl bg-red-700 p-8">

<h2 className="text-3xl font-black">

RED

</h2>

<p className="mt-5">

Real Estate Competency

</p>

</div>

<div className="rounded-xl bg-white p-8 text-black">

<h2 className="text-3xl font-black">

WHITE

</h2>

<p className="mt-5">

Financial Asset Competency

</p>

</div>

<div className="rounded-xl bg-blue-700 p-8">

<h2 className="text-3xl font-black">

BLUE

</h2>

<p className="mt-5">

Business Competency

</p>

</div>

</div>

</section>

</main>

);

}
