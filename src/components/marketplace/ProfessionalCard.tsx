import Link from "next/link";

export default function ProfessionalCard(){

return(

<div className="rounded-xl bg-slate-900 border border-slate-700 p-8">

<div className="flex justify-between">

<h2 className="text-2xl font-bold">

Professional Name

</h2>

<span className="text-green-400">

✔ Verified

</span>

</div>

<p className="mt-4 text-gray-400">

Category

</p>

<p className="mt-2">

★★★★★ 5.0

</p>

<Link

href="/marketplace/profile"

className="inline-block mt-8 rounded-lg bg-blue-600 px-6 py-3 font-bold">

View Profile

</Link>

</div>

);

}
