import Link from "next/link";

export default function FooterLinks(){

return(

<footer className="bg-slate-100 mt-20 p-10">

<div className="grid md:grid-cols-4 gap-6">

<Link href="/about">

Who We Are

</Link>

<Link href="/privacy">

Privacy

</Link>

<Link href="/terms">

Terms

</Link>

<Link href="/security">

Security

</Link>

<Link href="/faq">

FAQ

</Link>

<Link href="/contact">

Contact

</Link>

<Link href="/global-expansion">

Global Expansion

</Link>

<Link href="/marketplace">

Marketplace

</Link>

</div>

</footer>

);

}
