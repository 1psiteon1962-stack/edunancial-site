"use client";

export default function RegisterForm(){

return(

<section className="py-24">

<div className="max-w-2xl mx-auto px-6">

<h2 className="text-5xl font-black">

Create Account

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="First Name"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Last Name"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Email"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Country"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Password"/>

<button className="rounded-xl bg-green-600 py-4 text-xl font-bold">

Create Account

</button>

</div>

</div>

</section>

);

}
