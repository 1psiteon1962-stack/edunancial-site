export default function AfricaPayments(){

const providers=[

"Sendwave",

"Mobile Money",

"MTN Money",

"Airtel Money",

"Future Regional Providers"

];

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Africa Payment Center

</h2>

<div className="grid md:grid-cols-2 gap-6 mt-12">

{providers.map(provider=>(

<div
key={provider}
className="rounded-xl bg-slate-900 p-6">

<h3 className="text-2xl font-bold">

{provider}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
