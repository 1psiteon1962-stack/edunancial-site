import Link from "next/link";

export default function HomeEconomicDefensePreview(){

return(

<section className="py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Economic Self-Defense

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Inflation.

Debt.

Economic uncertainty.

Technology.

Financial education alone isn't enough.

Preparation is your strongest defense.

</p>

<Link
href="/economic-self-defense"
className="mt-12 inline-block rounded-xl bg-green-600 px-8 py-5 font-bold"
>

Discover More

</Link>

</div>

</section>

);

}
