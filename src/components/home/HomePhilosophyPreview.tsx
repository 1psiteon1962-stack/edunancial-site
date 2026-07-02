import Link from "next/link";

export default function HomePhilosophyPreview() {

return(

<section className="bg-[#111827] py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Our Philosophy

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Financial literacy provides the foundation.

Financial competency is built through disciplined action.

Economic competency is demonstrated through better decisions.

</p>

<Link
href="/philosophy"
className="mt-12 inline-block rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold"
>

Learn More

</Link>

</div>

</section>

);

}
