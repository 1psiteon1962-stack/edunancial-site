import KPIDashboard from "./KPIDashboard";
import RevenueDashboard from "./RevenueDashboard";
import ProfitMarginDashboard from "./ProfitMarginDashboard";
import BreakEvenDashboard from "./BreakEvenDashboard";
import CountryRevenueDashboard from "./CountryRevenueDashboard";

export default function ExecutiveScorecard(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Executive Scorecard

</h1>

<p className="mt-4 text-xl text-gray-400">

Know Your Numbers. Measure Everything.

</p>

<div className="space-y-10 mt-12">

<KPIDashboard/>

<RevenueDashboard/>

<ProfitMarginDashboard/>

<BreakEvenDashboard/>

<CountryRevenueDashboard/>

</div>

</section>

</main>

);

}
