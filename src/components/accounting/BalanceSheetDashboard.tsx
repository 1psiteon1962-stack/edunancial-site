export default function BalanceSheetDashboard(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Balance Sheet

</h1>

<div className="grid lg:grid-cols-3 gap-8 mt-12">

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-2xl font-bold">

Assets

</h2>

</div>

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-2xl font-bold">

Liabilities

</h2>

</div>

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-2xl font-bold">

Equity

</h2>

</div>

</div>

</section>

</main>

);

}
