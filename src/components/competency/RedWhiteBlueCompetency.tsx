export default function RedWhiteBlueCompetency(){

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-4xl font-black text-white">

The Red • White • Blue Framework

</h2>

<div className="mt-8 grid gap-6 md:grid-cols-3">

<div className="rounded-xl bg-red-700 p-6 text-white">
<h3 className="text-2xl font-black">RED</h3>
<p className="mt-3">
Real Estate Competency
</p>
</div>

<div className="rounded-xl bg-slate-100 p-6 text-slate-900">
<h3 className="text-2xl font-black">WHITE</h3>
<p className="mt-3">
Financial Asset Competency
</p>
</div>

<div className="rounded-xl bg-blue-700 p-6 text-white">
<h3 className="text-2xl font-black">BLUE</h3>
<p className="mt-3">
Business Competency
</p>
</div>

</div>

</section>

);

}
