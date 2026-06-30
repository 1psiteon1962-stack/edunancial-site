export default function InvoiceGenerator(){

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Invoice Generator

</h2>

<div className="grid gap-6 mt-12">

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Customer Name"
/>

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Invoice Number"
/>

<input
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
placeholder="Amount"
/>

<button
className="rounded-xl bg-blue-600 py-4 text-xl font-bold">

Generate Invoice

</button>

</div>

</div>

</section>

);

}
