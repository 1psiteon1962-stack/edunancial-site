"use client";

export default function BookDetail() {

return(

<section className="bg-[#08101f] py-24">

<div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

<div className="h-[600px] rounded-2xl bg-slate-800 flex items-center justify-center">

Book Cover

</div>

<div>

<h1 className="text-5xl font-black">

Book Title

</h1>

<p className="mt-8 text-xl text-gray-300">

Book description goes here.

</p>

<div className="grid grid-cols-2 gap-4 mt-10">

<div className="rounded-xl bg-slate-900 p-5">

Language

</div>

<div className="rounded-xl bg-slate-900 p-5">

Pages

</div>

<div className="rounded-xl bg-slate-900 p-5">

Audiobook

</div>

<div className="rounded-xl bg-slate-900 p-5">

PDF

</div>

</div>

<div className="flex gap-4 mt-12">

<button className="rounded-xl bg-blue-600 px-8 py-4 font-bold">

Buy Book

</button>

<button className="rounded-xl bg-green-600 px-8 py-4 font-bold">

Preview

</button>

</div>

</div>

</div>

</section>

);

}
