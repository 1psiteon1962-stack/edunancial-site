import RevenueDashboard from "./RevenueDashboard";
import ExpenseDashboard from "./ExpenseDashboard";
import ProfitLossDashboard from "./ProfitLossDashboard";
import CashFlowDashboard from "./CashFlowDashboard";

export default function ExecutiveFinancialDashboard(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Executive Financial Dashboard

</h1>

<p className="mt-4 text-xl text-gray-400">

Know Your Numbers.

</p>

<div className="space-y-10 mt-12">

<RevenueDashboard/>

<ExpenseDashboard/>

<ProfitLossDashboard/>

<CashFlowDashboard/>

</div>

</section>

</main>

);

}
