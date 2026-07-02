export default function RoadmapPage(){

const roadmap=[
"Assessment",
"Courses",
"Missions",
"Simulations",
"Passport",
"Certification"
];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-6xl px-6 py-24">

<h1 className="text-6xl font-black">

Your Learning Roadmap

</h1>

<div className="mt-16 space-y-8">

{roadmap.map(step=>(

<div
key={step}
className="rounded-xl bg-slate-900 p-8"
>

<h2 className="text-3xl font-bold">

{step}

</h2>

</div>

))}

</div>

</section>

</main>

);

}
