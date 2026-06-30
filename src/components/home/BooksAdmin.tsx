export default function BooksAdmin(){

return(

<section className="py-24 bg-[#101827]">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Books Administration

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Book Title"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Author"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Price"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Language"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Book Cover URL"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="PDF URL"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Audiobook URL"/>

<button className="rounded-xl bg-blue-600 py-4 font-bold hover:bg-blue-700">

Save Book

</button>

</div>

</div>

</section>

);

}
