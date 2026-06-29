import Link from "next/link";

export default function FeaturedVideos(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Featured Videos

</h2>

<p className="mt-4">

Watch free lessons and premium courses.

</p>

<Link
href="/video-player"
className="inline-block mt-6 rounded-lg bg-red-600 text-white px-5 py-3">

Watch Videos

</Link>

</section>

);

}
