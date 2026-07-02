import Link from "next/link";

export default function HomeExecutivePreview(){

return(

<section className="py-24">

<div className="mx-auto max-w-7xl px-6">

<p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">

COMING SOON

</p>

<h2 className="mt-6 text-6xl font-black">

Executive Learning Center

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Advanced business strategy.

AI coaching.

Executive dashboards.

International expansion.

Business simulations.

Financial competency at the executive level.

</p>

<Link
href="/executive"
className="mt-12 inline-block rounded-xl bg-blue-600 px-8 py-5 font-bold"
>

Learn More

</Link>

</div>

</section>

);

}
