"use client";

export default function BookUpload() {

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Upload New Book

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Book Title"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Subtitle"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Author"/>

<select className="rounded-xl bg-slate-900 border border-slate-700 p-5">

<option>RED</option>

<option>WHITE</option>

<option>BLUE</option>

<option>Business</option>

<option>AI</option>

</select>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Price"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Book Cover"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="PDF"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Audiobook"/>

<textarea className="rounded-xl bg-slate-900 border border-slate-700 p-5 min-h-48" placeholder="Book Description"/>

<button className="rounded-xl bg-blue-600 py-4 text-xl font-bold">

Publish Book

</button>

</div>

</div>

</section>

);

}
