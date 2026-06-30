"use client";

export default function Checkout(){

return(

<section className="bg-[#101827] py-24">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black">

Checkout

</h2>

<div className="grid gap-6 mt-10">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Full Name"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Email"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Country"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Coupon Code"/>

<button className="rounded-xl bg-green-600 py-4 text-xl font-bold">

Pay Securely

</button>

</div>

</div>

</section>

);

}
