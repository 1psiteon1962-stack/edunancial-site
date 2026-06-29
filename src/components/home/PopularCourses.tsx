import Link from "next/link";

export default function PopularCourses(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Most Popular Courses

</h2>

<p className="mt-4">

The courses students are taking the most.

</p>

<Link
href="/courses"
className="inline-block mt-6 rounded-lg bg-green-600 px-5 py-3 text-white">

Browse Courses

</Link>

</section>

);

}
