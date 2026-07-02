import Link from "next/link";

export default function HomeBusinessCompetency(){

return(

<section className="bg-[#111827] py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Business Competency

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Most businesses fail because owners don't know their numbers.

Revenue.

Profit.

Cash Flow.

KPIs.

Distribution.

Value Chain.

Learn to make decisions using measurable data.

</p>

<div className="mt-16 grid gap-8 md:grid-cols-3">

<Card title="Startup"/>

<Card title="Growth"/>

<Card title="Executive"/>

</div>

<Link
href="/courses/blue"
className="mt-12 inline-block rounded-xl bg-blue-600 px-8 py-5 font-bold"
>

Explore Business Courses

</Link>

</div>

</section>

);

}

function Card({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h3 className="text-2xl font-black">

{title}

</h3>

</div>

);

}
