export default function MarketplacePreview() {

const services = [

"CPAs",

"Bookkeepers",

"Insurance",

"Attorneys",

"Business Consultants",

"Commercial Realtors",

"Mortgage Brokers",

"Financial Coaches"

];

return(

<section className="mx-auto max-w-7xl px-6 py-20">

<h2 className="text-5xl font-black text-white">

Professional Marketplace

</h2>

<p className="text-gray-400 mt-6">

Find trusted professionals that help you build wealth.

</p>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

{services.map(service=>(

<div
key={service}
className="rounded-xl bg-slate-900 border border-slate-700 p-8">

<h3 className="text-2xl text-white font-bold">

{service}

</h3>

<p className="text-gray-400 mt-4">

Coming Soon

</p>

</div>

))}

</div>

</section>

);

}
