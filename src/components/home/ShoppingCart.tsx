"use client";

export default function ShoppingCart() {

const items=[
{title:"RED Course",price:"$149"},
{title:"Business Is About Making Profit",price:"$29"}
];

return(

<section className="bg-[#08101f] py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Shopping Cart

</h2>

<div className="space-y-6 mt-10">

{items.map(item=>(

<div
key={item.title}
className="rounded-xl bg-slate-900 border border-slate-700 p-6 flex justify-between">

<div>

<h3 className="text-2xl font-bold">

{item.title}

</h3>

</div>

<div className="text-xl font-bold">

{item.price}

</div>

</div>

))}

</div>

<button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold">

Proceed To Checkout

</button>

</div>

</section>

);

}
