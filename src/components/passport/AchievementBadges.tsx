export default function AchievementBadges(){

const badges=[

"First Course",

"First Business",

"Investor",

"Real Estate",

"Entrepreneur",

"Executive",

"Global Explorer",

"Financial Competency"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black text-white">

Achievement Badges

</h2>

<div className="mt-8 grid gap-4 md:grid-cols-4">

{badges.map(badge=>(

<div
key={badge}
className="rounded-lg bg-slate-800 p-5 text-center text-white"
>

🏆

<div className="mt-3">

{badge}

</div>

</div>

))}

</div>

</section>

);

}
