export default function MarketingReports(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Marketing Reports

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

<Card title="Subscribers"/>

<Card title="Lead Magnets"/>

<Card title="Revenue"/>

<Card title="Profit"/>

<Card title="LTV"/>

<Card title="CAC"/>

<Card title="ROAS"/>

<Card title="Conversion"/>

</div>

</main>

);

}

function Card({

title

}:{

title:string;

}){

return(

<div className="rounded-xl bg-slate-900 p-6">

<h2 className="text-xl font-bold">

{title}

</h2>

</div>

);

}
