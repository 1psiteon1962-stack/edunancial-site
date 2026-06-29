import Link from "next/link";

export default function ContinueLearningBanner(){

return(

<section className="rounded-xl bg-green-50 p-8">

<h2 className="text-3xl font-bold">

Continue Learning

</h2>

<Link
href="/continue-learning"
className="inline-block mt-6 rounded-lg bg-green-600 text-white px-5 py-3">

Resume Course

</Link>

</section>

);

}
