export default function PricingAdministrationPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white p-10">

<h1 className="text-6xl font-black">

Pricing Administration

</h1>

<div className="grid gap-6 mt-12">

<input
placeholder="Product Name"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="North America Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Caribbean Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Latin America Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Europe Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Africa Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<button
className="rounded-xl bg-blue-600 p-4 font-bold"
>

Save Pricing

</button>

</div>

</main>

);

}
