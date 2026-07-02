import Link from "next/link";

export default function HomePassportPreview() {

return(

<section className="bg-[#111827] py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-6xl font-black">

Edunancial Passport

</h2>

<p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

Every lesson.

Every assessment.

Every mission.

Every simulation.

Every achievement.

One permanent learning record.

</p>

<div className="mt-16">

<Link
href="/passport"
className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold"
>

View Passport

</Link>

</div>

</div>

</section>

);

}
