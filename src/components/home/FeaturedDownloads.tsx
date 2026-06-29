import Link from "next/link";

export default function FeaturedDownloads(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Free Downloads

</h2>

<p className="mt-4">

Templates, worksheets, checklists and financial tools.

</p>

<Link
href="/downloads"
className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white">

Browse Downloads

</Link>

</section>

);

}
