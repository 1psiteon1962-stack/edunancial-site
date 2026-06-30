"use client";

import { useState } from "react";

export default function FreeDownload() {

const [submitted,setSubmitted]=useState(false);

return(

<section className="bg-[#0b1326] py-24">

<div className="max-w-5xl mx-auto px-6">

<h2 className="text-5xl font-black text-center">

Free Download

</h2>

<p className="text-center text-xl text-gray-300 mt-6">

Download our free guide:
<strong> 10 Rules to Build Wealth</strong>

</p>

{submitted ? (

<div className="mt-10 rounded-xl bg-green-700 p-8 text-center text-2xl font-bold">

Thank you!

Your download will be available after email integration.

</div>

):(

<form className="mt-12 space-y-6">

<input

className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5"

placeholder="Full Name"

/>

<input

className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5"

placeholder="Email Address"

/>

<input

className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5"

placeholder="Country"

/>

<label className="flex gap-3">

<input type="checkbox"/>

<span>

I agree to receive emails from Edunancial.

</span>

</label>

<button

type="button"

onClick={()=>setSubmitted(true)}

className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"

>

Download Free Guide

</button>

</form>

)}

</div>

</section>

);

}
