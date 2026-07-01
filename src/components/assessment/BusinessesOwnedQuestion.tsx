export default function BusinessesOwnedQuestion(){

const options=[
"None",
"1",
"2-3",
"4-10",
"More than 10"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

How many businesses have you owned?

</h2>

<div className="mt-8 space-y-3">

{options.map(item=>(

<button
key={item}
className="w-full rounded-lg bg-slate-800 p-4 text-left text-white hover:bg-blue-700"
>

{item}

</button>

))}

</div>

</section>

);

}
