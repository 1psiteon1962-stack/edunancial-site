export default function DownloadAdministrationPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white p-10">

<h1 className="text-6xl font-black">

Download Administration

</h1>

<div className="grid gap-6 mt-12 lg:grid-cols-4">

<Card
title="Books"
/>

<Card
title="Audio Books"
/>

<Card
title="PDF Downloads"
/>

<Card
title="Certificates"
/>

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

<div
className="rounded-2xl bg-[#101a2f] border border-white/10 p-8"
>

<h2 className="text-3xl font-black">

{title}

</h2>

</div>

);

}
