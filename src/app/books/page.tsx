export default function BooksPage() {

const books=[

"RED 101",

"WHITE 101",

"BLUE 101",

"Business Is About Making Profit",

"Know Your Numbers",

"AI For Entrepreneurs",

"Creative Financing",

"Commercial Credit"

];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-7xl font-black">

Books

</h1>

<p className="mt-8 max-w-4xl text-2xl text-slate-300">

Every book moves you from financial literacy toward
financial competency.

</p>

<div className="mt-20 grid gap-6 md:grid-cols-2">

{books.map(book=>(

<div
key={book}
className="rounded-xl bg-slate-900 p-8"
>

<h2 className="text-2xl font-black">

{book}

</h2>

</div>

))}

</div>

</section>

</main>

);

}
