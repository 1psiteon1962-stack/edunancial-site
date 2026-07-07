import Link from "next/link";

export default function AssessmentStatusCard(){

return(

<div className="rounded-2xl bg-blue-900 p-10">

<h2 className="text-3xl font-black">

Assessment

</h2>

<p className="mt-6">

Status

</p>

<p className="text-4xl font-black text-yellow-300">

Not Started

</p>

<Link
href="/assessment"
className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-slate-900"
>

Start Assessment

</Link>

</div>

);

}
