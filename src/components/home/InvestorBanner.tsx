import Link from "next/link";

export default function InvestorBanner(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Investor Network

</h2>

<p className="mt-4">

Connect with entrepreneurs who voluntarily participate.

</p>

<Link
href="/investors"
className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 text-white">

Investor Center

</Link>

</section>

);

}
