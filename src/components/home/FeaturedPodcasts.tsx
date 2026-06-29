import Link from "next/link";

export default function FeaturedPodcasts(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Podcasts

</h2>

<Link
href="/audio-player"
className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-white">

Listen Now

</Link>

</section>

);

}
