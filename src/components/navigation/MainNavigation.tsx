import Link from "next/link";

export default function MainNavigation(){

const links=[
["Home","/"],
["Courses","/courses"],
["Marketplace","/marketplace"],
["Professionals","/marketplace/professionals"],
["AI","/ai"],
["Dashboard","/dashboard"],
["Funding","/funding-center"]
];

return(

<nav className="sticky top-0 bg-slate-950 text-white shadow-lg z-50">

<div className="max-w-7xl mx-auto flex gap-6 p-4">

{links.map(([title,href])=>(

<Link key={href} href={href}
className="hover:text-blue-400">

{title}

</Link>

))}

</div>

</nav>

);

}
