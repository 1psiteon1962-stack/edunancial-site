export default function ChooseYourPath(){

return(

<section className="bg-[#08101f] py-20">

<h2 className="text-center text-5xl font-black text-white">

Choose Your Path

</h2>

<div className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-3">

<Card
title="RED"
subtitle="Real Estate Competency"
/>

<Card
title="WHITE"
subtitle="Financial Asset Competency"
/>

<Card
title="BLUE"
subtitle="Business Competency"
/>

</div>

</section>

);

}

function Card({

title,

subtitle

}:{

title:string;

subtitle:string;

}){

return(

<div className="rounded-xl bg-slate-900 p-8 text-center">

<h3 className="text-5xl font-black text-white">

{title}

</h3>

<p className="mt-6 text-xl text-slate-300">

{subtitle}

</p>

</div>

);

}
