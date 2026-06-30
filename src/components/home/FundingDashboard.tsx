export default function FundingDashboard() {

const cards=[

"Government Grants",

"Business Loans",

"Angel Investors",

"Venture Capital",

"Crowdfunding",

"Microloans"

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Funding Dashboard

</h2>

<div className="grid md:grid-cols-3 gap-8 mt-12">

{cards.map(card=>(

<div
key={card}
className="rounded-xl bg-[#111827] p-8">

<h3 className="text-2xl font-bold">

{card}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
