import Link from "next/link";

const professionals = [

{ title:"Attorney", color:"bg-red-900" },

{ title:"CPA", color:"bg-blue-900" },

{ title:"Bookkeeper", color:"bg-green-900" },

{ title:"Commercial Realtor", color:"bg-yellow-900" },

{ title:"Residential Realtor", color:"bg-purple-900" },

{ title:"Mortgage Broker", color:"bg-cyan-900" },

{ title:"Insurance Professional", color:"bg-orange-900" },

{ title:"Business Consultant", color:"bg-pink-900" },

{ title:"Financial Coach", color:"bg-indigo-900" },

{ title:"1031 Exchange Specialist", color:"bg-emerald-900" }

];

export default function ProfessionalDirectory(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Professional Directory

</h1>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

{professionals.map((item)=>(

<Link

key={item.title}

href="/marketplace/search"

className={`${item.color} rounded-xl p-8 hover:scale-105 transition`}>

<h2 className="text-2xl font-bold">

{item.title}

</h2>

<p className="mt-4">

Browse Professionals

</p>

</Link>

))}

</div>

</section>

</main>

);

}
