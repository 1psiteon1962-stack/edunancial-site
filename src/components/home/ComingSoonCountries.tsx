export default function ComingSoonCountries(){

const countries=[

"Uganda",

"Kenya",

"Nigeria",

"Ghana",

"Dominican Republic",

"Mexico",

"Brazil",

"Spain"

];

return(

<section className="mt-10">

<h2 className="text-3xl font-bold">

Coming Soon

</h2>

<div className="grid md:grid-cols-4 gap-4 mt-6">

{countries.map(country=>(

<div
key={country}
className="rounded-lg border p-4 bg-slate-50">

{country}

</div>

))}

</div>

</section>

);

}
