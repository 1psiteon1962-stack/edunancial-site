import Link from "next/link";

export default function BusinessBuilderBanner(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Build Your Business

</h2>

<p className="mt-4">

Business plans, KPIs, budgeting and startup guidance.

</p>

<Link
href="/business-builder"
className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-white">

Open Business Builder

</Link>

</section>

);

}
