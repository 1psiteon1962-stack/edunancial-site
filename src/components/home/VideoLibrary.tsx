export default function VideoLibrary(){

const videos=[

"Introduction",

"RED",

"WHITE",

"BLUE",

"Business KPI",

"Funding",

"Artificial Intelligence",

"Economic Self Defense"

];

return(

<section className="py-24">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Video Library

</h2>

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-12">

{videos.map(video=>(

<div

key={video}

className="rounded-2xl bg-slate-900 border border-slate-700 p-6">

<div className="h-44 rounded-xl bg-slate-800 flex items-center justify-center">

Video Placeholder

</div>

<h3 className="mt-6 text-2xl font-bold">

{video}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
