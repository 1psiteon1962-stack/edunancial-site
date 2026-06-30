export default function PaymentOptions(){

const payments=[

"Square",

"Visa",

"Mastercard",

"PayPal",

"Bank Transfer",

"Future Regional Payment Providers"

];

return(

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Payment Options

</h2>

<div className="grid md:grid-cols-3 gap-6 mt-12">

{payments.map(payment=>(

<div
key={payment}
className="rounded-xl bg-[#111827] p-8">

<h3 className="text-2xl font-bold">

{payment}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
