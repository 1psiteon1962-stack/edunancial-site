export default function ValuesPage(){

const values=[

"Integrity",

"Education",

"Curiosity",

"Personal Responsibility",

"Continuous Learning",

"Profit Through Knowledge",

"Respect",

"Innovation"

];

return(

<main className="min-h-screen bg-slate-100">

<div className="max-w-6xl mx-auto p-10">

<h1 className="text-5xl font-black">

Our Values

</h1>

<div className="grid lg:grid-cols-2 gap-6 mt-10">

{values.map(value=>(

<div
key={value}
className="rounded-xl bg-white shadow p-6">

{value}

</div>

))}

</div>

</div>

</main>

);

}
