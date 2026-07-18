export default function FamilyChallengesPage() {

const challenges = [

"Create a Family Budget",

"Reduce Monthly Expenses",

"Start a Savings Goal",

"Read One Financial Book Together",

"Create a Business Idea",

"Track Spending for 30 Days"

];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-6xl font-black">

Family Challenges

</h1>

<div className="mt-16 space-y-5">

{challenges.map(challenge=>(

<div
key={challenge}
className="rounded-xl bg-slate-900 p-8"
>

{challenge}

</div>

))}

</div>

</section>

</main>

);

}
