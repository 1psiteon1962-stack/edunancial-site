import Link from "next/link";

const items = [
  ["AI Assistant","/ai"],
  ["Funding Center","/funding"],
  ["Startup Hub","/startup-hub"],
  ["Marketplace","/marketplace"],
  ["Calculators","/calculators"],
  ["Courses","/courses"],
];

export default function HomeQuickAccess(){

return(

<section className="grid md:grid-cols-3 gap-6 mt-10">

{items.map(([title,url])=>(

<Link
key={title}
href={url}
className="rounded-xl border bg-white p-8 shadow hover:shadow-lg transition">

<h3 className="text-2xl font-bold">

{title}

</h3>

<p className="mt-3 text-gray-600">

Open {title}

</p>

</Link>

))}

</section>

);

}
