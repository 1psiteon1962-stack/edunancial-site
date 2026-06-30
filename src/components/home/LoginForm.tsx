"use client";

export default function LoginForm(){

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-xl mx-auto px-6">

<h2 className="text-5xl font-black">

Member Login

</h2>

<div className="grid gap-6 mt-12">

<input
type="email"
placeholder="Email Address"
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
/>

<input
type="password"
placeholder="Password"
className="rounded-xl bg-slate-900 border border-slate-700 p-5"
/>

<button
className="rounded-xl bg-blue-600 py-4 text-xl font-bold">

Login

</button>

</div>

</div>

</section>

);

}
