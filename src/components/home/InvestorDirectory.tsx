export default function InvestorDirectory(){

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Investor Directory

</h2>

<div className="grid md:grid-cols-3 gap-8 mt-12">

{[1,2,3,4,5,6].map((item)=>(

<div
key={item}
className="rounded-xl bg-slate-900 p-8">

<h3 className="text-2xl font-bold">

Investor {item}

</h3>

<p className="mt-4 text-gray-400">

Investment Interests

</p>

</div>

))}

</div>

</div>

</section>

);

}
