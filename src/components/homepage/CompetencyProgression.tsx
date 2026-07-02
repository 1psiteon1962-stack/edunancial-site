export default function CompetencyProgression(){

const items=[

"Financial Literacy",

"Financial Competency",

"Economic Competency",

"Business Ownership",

"Wealth Creation",

"Generational Impact"

];

return(

<section className="bg-slate-900 py-20">

<h2 className="text-center text-5xl font-black text-white">

The Edunancial Journey

</h2>

<div className="mx-auto mt-16 max-w-6xl">

{items.map((item,index)=>(

<div
key={item}
className="mb-8 text-center"
>

<div className="text-3xl font-bold text-white">

{item}

</div>

{index<items.length-1 && (

<div className="mt-5 text-5xl text-blue-500">

↓

</div>

)}

</div>

))}

</div>

</section>

);

}
