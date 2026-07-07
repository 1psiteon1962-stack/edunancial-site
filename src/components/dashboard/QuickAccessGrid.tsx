import Link from "next/link";

const cards = [

["Financial Literacy","/courses"],

["Financial Competency","/competency"],

["Entrepreneurship","/business"],

["Investing","/investing"],

["Real Estate","/real-estate"],

["AI for Business","/ai"],

["Marketplace","/marketplace"],

["Membership","/membership"],

];

export default function QuickAccessGrid(){

return(

<section className="py-20">

<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

{cards.map(([title,url])=>(

<Link
key={title}
href={url}
className="rounded-2xl bg-slate-900 p-10 hover:bg-slate-800"
>

<h3 className="text-2xl font-black">

{title}

</h3>

</Link>

))}

</div>

</section>

);

}
