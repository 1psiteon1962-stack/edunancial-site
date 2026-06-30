"use client";

export default function CouponManager(){

return(

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Coupon Manager

</h2>

<div className="grid gap-6 mt-10">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Coupon"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Discount %"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Expiration Date"/>

<button className="rounded-xl bg-blue-600 py-4 font-bold">

Save Coupon

</button>

</div>

</div>

</section>

);

}
