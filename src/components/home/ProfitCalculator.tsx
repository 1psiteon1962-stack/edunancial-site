"use client";

export default function ProfitCalculator(){

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black">

Profit Calculator

</h2>

<div className="grid gap-6 mt-12">

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Revenue"
/>

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Expenses"
/>

<button
className="rounded-xl bg-green-600 py-4 text-xl font-bold">

Calculate Profit

</button>

</div>

</div>

</section>

);

}
