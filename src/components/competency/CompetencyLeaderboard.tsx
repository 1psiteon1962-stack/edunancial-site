export default function CompetencyLeaderboard(){

const users=[

"Alex",

"Maria",

"James",

"Fatima",

"Samuel"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Leaderboard

</h2>

<div className="mt-8 space-y-3">

{users.map((user,index)=>(

<div
key={user}
className="flex justify-between rounded-lg bg-slate-800 p-4 text-white"
>

<span>

#{index+1} {user}

</span>

<span>

{15000-(index*1200)} XP

</span>

</div>

))}

</div>

</section>

);

}
