export default function BusinessMaturityPage(){

const levels=[

"Startup",

"Growing",

"Established",

"Scaling",

"Enterprise"

];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-6xl px-6 py-24">

<h1 className="text-6xl font-black">

Business Maturity Assessment

</h1>

<div className="mt-16 space-y-6">

{levels.map(level=>(

<div
key={level}
className="rounded-xl bg-slate-900 p-8"
>

<h2 className="text-3xl font-bold">

{level}

</h2>

</div>

))}

</div>

</section>

</main>

);

}
