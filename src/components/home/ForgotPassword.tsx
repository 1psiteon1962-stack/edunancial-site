"use client";

export default function ForgotPassword(){

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-xl mx-auto px-6">

<h2 className="text-5xl font-black">

Forgot Password

</h2>

<input
className="w-full rounded-xl bg-slate-900 border border-slate-700 p-5 mt-12"
placeholder="Email Address"
/>

<button
className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-xl font-bold">

Send Reset Link

</button>

</div>

</section>

);

}
