import Link from "next/link";

export default function AIWorkspaceBanner(){

return(

<section className="rounded-xl bg-slate-900 text-white p-8">

<h2 className="text-3xl font-bold">

AI Workspace

</h2>

<p className="mt-4">

Save AI conversations, organize research, and build courses.

</p>

<Link
href="/ai"
className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white">

Open Workspace

</Link>

</section>

);

}
