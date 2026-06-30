import Link from "next/link";

export default function MainNavigation(){

return(

<nav className="bg-slate-900 text-white p-4">

<div className="max-w-7xl mx-auto flex gap-6">

<Link href="/">Home</Link>

<Link href="/courses">Courses</Link>

<Link href="/marketplace">Marketplace</Link>

<Link href="/funding">Funding</Link>

<Link href="/startup-hub">Startup Hub</Link>

<Link href="/global-expansion">Global</Link>

<Link href="/contact">Contact</Link>

</div>

</nav>

);

}
