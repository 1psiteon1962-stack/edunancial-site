import Link from "next/link";

export default function HomeFamilyPreview(){

return(

<section className="bg-[#111827] py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Family Learning

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Build financial competency together.

Parents.

Children.

Grandparents.

One shared learning experience.

</p>

<div className="mt-16 grid gap-8 md:grid-cols-3">

<Box title="Children"/>

<Box title="Teen Entrepreneurs"/>

<Box title="Family Challenges"/>

</div>

<Link
href="/family"
className="mt-12 inline-block rounded-xl bg-green-600 px-8 py-5 font-bold"
>

Explore Family Learning

</Link>

</div>

</section>

);

}

function Box({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h3 className="text-2xl font-black">

{title}

</h3>

</div>

);

}
