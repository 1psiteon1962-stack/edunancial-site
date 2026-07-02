import Link from "next/link";

export default function HomeMarketplacePreview(){

return(

<section className="py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Marketplace

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Learning is only part of the journey.

Connect with professionals who can help you apply what you've learned.

</p>

<div className="mt-16 grid gap-6 md:grid-cols-4">

<Card title="Attorneys"/>

<Card title="Accountants"/>

<Card title="Lenders"/>

<Card title="Business Advisors"/>

</div>

<Link
href="/marketplace"
className="mt-12 inline-block rounded-xl bg-blue-600 px-8 py-5 font-bold"
>

Explore Marketplace

</Link>

</div>

</section>

);

}

function Card({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-6">

<h3 className="text-xl font-bold">

{title}

</h3>

</div>

);

}
