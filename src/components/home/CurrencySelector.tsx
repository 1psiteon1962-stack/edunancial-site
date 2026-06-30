"use client";

export default function CurrencySelector(){

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black">

Currency

</h2>

<select
className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5 mt-10">

<option>USD</option>

<option>CAD</option>

<option>UGX</option>

<option>KES</option>

<option>NGN</option>

<option>GHS</option>

<option>DOP</option>

<option>EUR</option>

<option>GBP</option>

</select>

</div>

</section>

);

}
