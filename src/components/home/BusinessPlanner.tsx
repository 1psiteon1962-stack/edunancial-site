"use client";

export default function BusinessPlanner(){

return(

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Business Planner

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Business Name"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Industry"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Country"/>

<textarea className="rounded-xl bg-slate-900 border border-slate-700 p-5 min-h-48" placeholder="Business Description"/>

<button className="rounded-xl bg-blue-600 py-4 text-xl font-bold">

Save Business Plan

</button>

</div>

</div>

</section>

);

}
