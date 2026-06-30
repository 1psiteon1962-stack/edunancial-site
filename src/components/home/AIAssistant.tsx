"use client";

export default function AIAssistant() {

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Edunancial AI Assistant

</h2>

<p className="mt-6 text-xl text-gray-300">

Ask questions about Real Estate, Paper Assets, Business and Financial Literacy.

</p>

<div className="rounded-2xl bg-[#111827] border border-slate-700 mt-12 p-8">

<textarea
className="w-full min-h-48 rounded-xl bg-slate-900 p-5"
placeholder="Ask your financial question..."
/>

<button
className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold">

Ask AI

</button>

</div>

</div>

</section>

);

}
