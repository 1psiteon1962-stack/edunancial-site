export default function Languages(){

const languages=[

"English",

"Español",

"Français",

"Português",

"العربية"

];

return(

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Languages

</h2>

<div className="grid md:grid-cols-5 gap-6 mt-12">

{languages.map(language=>(

<div
key={language}
className="rounded-xl bg-[#111827] p-8 text-center">

<h3 className="text-2xl font-bold">

{language}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
