"use client";

export default function ContactSection(){

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black">

Contact Us

</h2>

<div className="grid gap-6 mt-12">

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Your Name"
/>

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Email Address"
/>

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Country"
/>

<textarea
className="rounded-xl bg-slate-900 border border-slate-700 p-5 min-h-48"
placeholder="Message"
/>

<button
className="rounded-xl bg-blue-600 py-4 text-xl font-bold hover:bg-blue-700">

Send Message

</button>

</div>

</div>

</section>

);
}
