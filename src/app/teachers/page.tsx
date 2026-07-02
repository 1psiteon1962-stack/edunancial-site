export default function TeachersPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-6xl font-black">

Teacher Dashboard

</h1>

<p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Track classroom progress,
student competency,
course completion,
missions,
and assessments from one dashboard.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-4">

<Card title="Students"/>

<Card title="Courses"/>

<Card title="Assessments"/>

<Card title="Certificates"/>

</div>

</section>

</main>

);

}

function Card({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-2xl font-bold">

{title}

</h2>

</div>

);

}
