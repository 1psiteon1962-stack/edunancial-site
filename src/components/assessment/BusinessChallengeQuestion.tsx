export default function BusinessChallengeQuestion(){

const items=[
"Cash Flow",
"Hiring",
"Sales",
"Marketing",
"Scaling",
"Profit",
"Operations",
"Leadership",
"Distribution",
"Value Chain"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

What keeps you awake at night?

</h2>

<div className="mt-8 grid gap-4 md:grid-cols-2">

{items.map(item=>(

<button
key={item}
className="rounded-lg bg-slate-800 p-4 text-white hover:bg-blue-700"
>

{item}

</button>

))}

</div>

</section>

);

}
