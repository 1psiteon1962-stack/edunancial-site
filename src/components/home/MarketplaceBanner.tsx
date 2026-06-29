import Link from "next/link";

export default function MarketplaceBanner(){

return(

<section className="rounded-xl border p-8">

<h2 className="text-3xl font-bold">

Professional Marketplace

</h2>

<Link href="/marketplace">

Browse Professionals

</Link>

</section>

);

}
