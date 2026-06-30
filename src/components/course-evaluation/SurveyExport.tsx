"use client";

export default function SurveyExport(){

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black">

Survey Export

</h2>

<div className="flex flex-wrap gap-4 mt-8">

<button className="rounded-lg bg-blue-600 px-6 py-3 font-bold">

Export CSV

</button>

<button className="rounded-lg bg-green-600 px-6 py-3 font-bold">

Export Excel

</button>

<button className="rounded-lg bg-red-600 px-6 py-3 font-bold">

Export PDF

</button>

</div>

</section>

);

}
