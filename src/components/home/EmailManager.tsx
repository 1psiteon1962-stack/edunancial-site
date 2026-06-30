"use client";

export default function EmailManager(){

return(

<section className="bg-[#101827] py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Email List Manager

</h2>

<div className="grid gap-6 mt-12">

<div className="rounded-xl bg-slate-900 p-6">

Total Subscribers

</div>

<div className="rounded-xl bg-slate-900 p-6">

Today's Signups

</div>

<div className="rounded-xl bg-slate-900 p-6">

Downloads Completed

</div>

<div className="rounded-xl bg-slate-900 p-6">

Newsletter Campaigns

</div>

<button className="rounded-xl bg-blue-600 py-4 text-xl font-bold">

Export CSV

</button>

<button className="rounded-xl bg-green-600 py-4 text-xl font-bold">

Send Newsletter

</button>

</div>

</div>

</section>

);

}
