import Link from "next/link";

export default function QuickActions(){

return(

<section className="grid lg:grid-cols-4 gap-6">

<Link href="/courses">Start Learning</Link>

<Link href="/free-download">Free Guide</Link>

<Link href="/marketplace">Find Professionals</Link>

<Link href="/funding-center">Funding Center</Link>

</section>

);

}
