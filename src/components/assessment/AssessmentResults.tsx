import BusinessMaturityScore from "./BusinessMaturityScore";
import BusinessProfileAnalysis from "./BusinessProfileAnalysis";
import EntrepreneurType from "./EntrepreneurType";
import AIRecommendations from "./AIRecommendations";

export default function AssessmentResults(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="mx-auto max-w-7xl px-6 py-16">

<h1 className="text-5xl font-black">

Your Edunancial Assessment

</h1>

<p className="mt-5 max-w-3xl text-xl text-slate-300">

Your responses have been analyzed to identify your current
business maturity, strengths, bottlenecks, and recommended
next steps.

</p>

<div className="mt-12 space-y-10">

<BusinessMaturityScore/>

<BusinessProfileAnalysis/>

<EntrepreneurType/>

<AIRecommendations/>

</div>

</section>

</main>

);

}
