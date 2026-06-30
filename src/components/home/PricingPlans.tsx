import Link from "next/link";

export default function PricingPlans() {

const plans=[

{
name:"Free",
price:"$0",
items:[
"Free Downloads",
"Newsletter",
"Selected Videos"
]
},

{
name:"Basic",
price:"Coming Soon",
items:[
"All Beginner Courses",
"Worksheets",
"Progress Tracking"
]
},

{
name:"Gold",
price:"Coming Soon",
items:[
"All Courses",
"Certificates",
"Priority Support"
]
}

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black text-center">

Membership Plans

</h2>

<div className="grid lg:grid-cols-3 gap-8 mt-12">

{plans.map(plan=>(

<div
key={plan.name}
className="rounded-2xl bg-[#111827] border border-slate-700 p-8">

<h3 className="text-3xl font-black">

{plan.name}

</h3>

<p className="text-4xl font-bold mt-6">

{plan.price}

</p>

<ul className="mt-8 space-y-3">

{plan.items.map(item=>(

<li key={item}>

• {item}

</li>

))}

</ul>

<Link
href="/checkout"
className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold">

Choose Plan

</Link>

</div>

))}

</div>

</div>

</section>

);

}
