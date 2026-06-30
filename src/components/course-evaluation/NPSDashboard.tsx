export default function NPSDashboard(){

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black">

Net Promoter Score

</h2>

<div className="grid md:grid-cols-4 gap-6 mt-8">

<div className="rounded-lg bg-slate-800 p-6">

Promoters

</div>

<div className="rounded-lg bg-slate-800 p-6">

Passives

</div>

<div className="rounded-lg bg-slate-800 p-6">

Detractors

</div>

<div className="rounded-lg bg-slate-800 p-6">

Overall NPS

</div>

</div>

</section>

);

}
