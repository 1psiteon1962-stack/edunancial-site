export default function LanguageDashboard(){

const languages=[

"English",

"Spanish",

"French",

"Portuguese",

"Arabic",

"Japanese",

"Korean",

"German",

"Italian"

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Language Dashboard

</h1>

<div className="grid gap-4 mt-10">

{languages.map(language=>(

<div
key={language}
className="rounded-xl bg-slate-900 p-5">

{language}

</div>

))}

</div>

</main>

);

}
