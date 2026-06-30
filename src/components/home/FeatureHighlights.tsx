export default function FeatureHighlights(){

const features=[

"AI Financial Assistant",

"Business KPI Dashboard",

"Funding Center",

"Professional Marketplace",

"Voice AI",

"Global Expansion"

];

return(

<section className="mt-12">

<h2 className="text-3xl font-bold">

Platform Features

</h2>

<ul className="mt-6 space-y-3">

{features.map(item=>(

<li key={item}>

✓ {item}

</li>

))}

</ul>

</section>

);

}
