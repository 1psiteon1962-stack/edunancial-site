import Link from "next/link";

export default function FeaturedTools(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Business Tools

</h2>

<p className="mt-4">

ROI, cash flow, break-even, LTV, CAC and profit calculators.

</p>

<Link
href="/calculators"
className="inline-block mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-white">

Open Tools

</Link>

</section>

);

}
