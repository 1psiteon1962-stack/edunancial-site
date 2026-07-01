import RevenueForecastDashboard from "./RevenueForecastDashboard";
import SubscriptionAnalytics from "./SubscriptionAnalytics";
import RegionalPerformanceDashboard from "./RegionalPerformanceDashboard";
import CountryPerformanceDashboard from "./CountryPerformanceDashboard";
import ExecutiveScorecard from "./ExecutiveScorecard";

export default function ExecutiveRevenueCenter(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Executive Revenue Center

</h1>

<p className="mt-4 text-xl text-gray-400">

Know Your Numbers. Forecast Your Future.

</p>

<div className="space-y-10 mt-12">

<ExecutiveScorecard/>

<RevenueForecastDashboard/>

<SubscriptionAnalytics/>

<RegionalPerformanceDashboard/>

<CountryPerformanceDashboard/>

</div>

</section>

</main>

);

}
