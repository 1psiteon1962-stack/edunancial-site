export default function MarketingDashboard(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Marketing Dashboard

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

<Card
title="Subscribers"
value="0"
/>

<Card
title="CAC"
value="$0.00"
/>

<Card
title="LTV"
value="$0.00"
/>

<Card
title="Conversion"
value="0%"
/>

<Card
title="Revenue"
value="$0.00"
/>

<Card
title="Open Rate"
value="0%"
/>

<Card
title="Click Rate"
value="0%"
/>

<Card
title="Lead Magnets"
value="0"
/>

</div>

</main>

);

}

function Card({

title,

value

}:{

title:string;

value:string;

}){

return(

<div className="rounded-xl bg-slate-900 p-6">

<p className="text-slate-400">

{title}

</p>

<h2 className="mt-3 text-3xl font-bold">

{value}

</h2>

</div>

);

}
