"use client";

export default function CountrySelector(){

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black">

Choose Your Country

</h2>

<select
className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5 mt-10">

<option>United States</option>

<option>Canada</option>

<option>Uganda</option>

<option>Kenya</option>

<option>Nigeria</option>

<option>Ghana</option>

<option>Dominican Republic</option>

<option>Puerto Rico</option>

<option>Mexico</option>

<option>Brazil</option>

</select>

<button
className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold">

Continue

</button>

</div>

</section>

);

}
