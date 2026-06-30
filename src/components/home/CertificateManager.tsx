"use client";

export default function CertificateManager(){

return(

<section className="py-24 bg-[#101827]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Certificate Manager

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Course Name"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Certificate Template"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Passing Score"/>

<label className="flex gap-3">

<input type="checkbox"/>

<span>

Automatically issue certificate when course is completed.

</span>

</label>

<button className="rounded-xl bg-green-600 py-4 text-xl font-bold">

Save Certificate Settings

</button>

</div>

</div>

</section>

);

}
