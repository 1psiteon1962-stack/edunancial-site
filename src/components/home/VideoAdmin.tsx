"use client";

export default function VideoAdmin(){

return(

<section className="bg-[#101827] py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Video Administration

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Video Title"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="YouTube / Vimeo URL"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Thumbnail URL"/>

<select className="rounded-xl bg-slate-900 border border-slate-700 p-5">

<option>RED</option>

<option>WHITE</option>

<option>BLUE</option>

<option>Business</option>

<option>AI</option>

</select>

<button className="rounded-xl bg-blue-600 py-4 text-xl font-bold hover:bg-blue-700">

Publish Video

</button>

</div>

</div>

</section>

);

}
