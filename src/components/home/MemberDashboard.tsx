export default function MemberDashboard() {

const cards = [

"Purchased Courses",

"My Books",

"Certificates",

"Downloads",

"Saved Progress",

"Account Settings"

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Member Dashboard

</h2>

<p className="mt-6 text-xl text-gray-300">

Everything you purchase will appear here.

</p>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

{cards.map(card=>(

<div
key={card}
className="rounded-2xl bg-slate-900 border border-slate-700 p-8">

<h3 className="text-2xl font-bold">

{card}

</h3>

<p className="mt-4 text-gray-400">

Coming Soon

</p>

</div>

))}

</div>

</div>

</section>

);

}
