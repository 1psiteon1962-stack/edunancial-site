export default function WeeklyCompetencyReport(){

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Weekly Competency Report

</h2>

<div className="mt-8 grid gap-6 md:grid-cols-4">

<Card title="XP Earned" value="450"/>

<Card title="Lessons" value="8"/>

<Card title="Missions" value="5"/>

<Card title="Competency" value="+6%"/>

</div>

</section>

);

}

function Card({title,value}:{title:string,value:string}){

return(

<div className="rounded-lg bg-slate-800 p-5">

<div className="text-slate-400">

{title}

</div>

<div className="mt-3 text-3xl font-black text-white">

{value}

</div>

</div>

);

}
