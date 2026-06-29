import Link from "next/link";

export default function FeaturedInstructors(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Featured Instructors

</h2>

<p className="mt-4">

Learn from experienced entrepreneurs and professionals.

</p>

<Link
href="/instructors"
className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white">

Meet the Instructors

</Link>

</section>

);

}
