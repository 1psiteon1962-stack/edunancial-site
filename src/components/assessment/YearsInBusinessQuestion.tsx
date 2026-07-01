export default function YearsInBusinessQuestion() {

const options=[
"Never owned a business",
"0-3 Years",
"4-7 Years",
"8-15 Years",
"15+ Years"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

How many years have you been in business?

</h2>

<div className="mt-8 space-y-3">

{options.map(option=>(

<button
key={option}
className="w-full rounded-lg bg-slate-800 p-4 text-left text-white hover:bg-blue-700"
>

{option}

</button>

))}

</div>

</section>

);

}
