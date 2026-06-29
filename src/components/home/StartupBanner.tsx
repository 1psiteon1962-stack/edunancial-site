import Link from "next/link";

export default function StartupBanner(){

return(

<section className="rounded-xl border p-8">

<h2 className="text-3xl font-bold">

Startup Hub

</h2>

<Link href="/startups">

Build Your Business

</Link>

</section>

);

}
