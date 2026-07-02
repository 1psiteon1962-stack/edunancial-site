export default function BusinessMaturityScore(){

const score=72;

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Business Maturity Score

</h2>

<div className="mt-8 flex items-center justify-center">

<div className="flex h-56 w-56 items-center justify-center rounded-full border-8 border-blue-500">

<div>

<p className="text-center text-6xl font-black text-white">

{score}

</p>

<p className="mt-2 text-center text-slate-400">

out of 100

</p>

</div>

</div>

</div>

</section>

);

}
