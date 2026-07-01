import GlobalExecutiveCommandCenter from "./GlobalExecutiveCommandCenter";
import AIExecutiveInsights from "./AIExecutiveInsights";
import FinancialAlerts from "./FinancialAlerts";
import ExecutiveGoals from "./ExecutiveGoals";
import ExecutiveTasks from "./ExecutiveTasks";

export default function CEOCommandCenter(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-6xl font-black">

CEO Command Center

</h1>

<p className="mt-4 text-xl text-gray-400">

One Dashboard. One Company. One Global Mission.

</p>

<div className="space-y-10 mt-12">

<FinancialAlerts/>

<AIExecutiveInsights/>

<ExecutiveGoals/>

<ExecutiveTasks/>

<GlobalExecutiveCommandCenter/>

</div>

</section>

</main>

);

}
