import Link from "next/link";

export default function FeaturedBooks(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Featured Marketplace

</h2>

<p className="mt-4">

Financial literacy books, audiobooks and study guides.

</p>

<Link
href="/marketplace"
className="inline-block mt-6 rounded-lg bg-blue-600 text-white px-5 py-3">

Browse Marketplace

</Link>

</section>

);

}
