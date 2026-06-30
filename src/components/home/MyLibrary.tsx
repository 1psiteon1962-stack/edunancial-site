export default function MyLibrary(){

const items=[

"My Courses",

"My Books",

"My Videos",

"My Downloads",

"My Certificates",

"Saved Items"

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

My Library

</h2>

<div className="grid md:grid-cols-3 gap-8 mt-12">

{items.map(item=>(

<div
key={item}
className="rounded-xl bg-[#111827] p-8">

<h3 className="text-2xl font-bold">

{item}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
