export default function MarketplacePage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-7xl font-black">

Marketplace

</h1>

<p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

Connect with professionals who help you
apply what you've learned.

</p>

<div className="mt-20 grid gap-8 md:grid-cols-4">

<Card title="Attorneys"/>

<Card title="Accountants"/>

<Card title="Real Estate"/>

<Card title="Business Advisors"/>

<Card title="Lenders"/>

<Card title="Insurance"/>

<Card title="Tax Professionals"/>

<Card title="Investors"/>

</div>

</section>

</main>

);

}

function Card({title}:{title:string}){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-xl font-bold">

{title}

</h2>

</div>

);

}
