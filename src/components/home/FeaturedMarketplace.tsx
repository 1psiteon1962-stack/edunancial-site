import Link from "next/link";

export default function FeaturedMarketplace(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Marketplace

</h2>

<p className="mt-4">

Attorneys, CPAs, insurance professionals, consultants and more.

</p>

<Link
href="/marketplace"
className="inline-block mt-6 rounded-lg bg-red-600 px-5 py-3 text-white">

Open Marketplace

</Link>

</section>

);

}
