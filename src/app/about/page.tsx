import Link from "next/link";

export default function AboutPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-6xl px-6 py-24 text-center">

<h1 className="text-7xl font-black">

About
Edunancial

</h1>

<p className="mx-auto mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Edunancial is an educational platform dedicated to helping
people develop Financial Competency through practical learning,
real-world application, and continuous improvement.

</p>

<div className="mt-20 flex flex-wrap justify-center gap-6">

<Link
href="/why-edunancial"
className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold"
>

Our Story

</Link>

<Link
href="/philosophy"
className="rounded-xl border border-white px-8 py-5 text-xl font-bold"
>

Our Philosophy

</Link>

<Link
href="/economic-self-defense"
className="rounded-xl border border-white px-8 py-5 text-xl font-bold"
>

Economic Self-Defense

</Link>

</div>

</section>

</main>

);

}
