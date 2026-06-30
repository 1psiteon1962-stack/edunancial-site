export default function AskEdunancial(){

const questions=[

"How do I start investing?",

"What is Economic Self Defense?",

"How do I improve my credit?",

"Should I start a business?",

"What is a KPI?",

"What course should I begin with?"

];

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Popular Questions

</h2>

<div className="grid md:grid-cols-2 gap-6 mt-12">

{questions.map(question=>(

<div
key={question}
className="rounded-xl bg-slate-900 p-6">

{question}

</div>

))}

</div>

</div>

</section>

);

}
