import Link from "next/link";

export default function FundingBanner(){

return(

<section className="rounded-xl border p-8">

<h2 className="text-3xl font-bold">

Need Capital?

</h2>

<Link href="/funding-center">

Explore Funding

</Link>

</section>

);

}
