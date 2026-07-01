import CustomerAnalyticsDashboard from "./CustomerAnalyticsDashboard";
import CourseRevenueDashboard from "./CourseRevenueDashboard";
import BookRevenueDashboard from "./BookRevenueDashboard";
import MarketplaceRevenueDashboard from "./MarketplaceRevenueDashboard";
import CountryRevenueDashboard from "./CountryRevenueDashboard";

export default function GlobalRevenueCommandCenter(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Global Revenue Command Center

</h1>

<p className="mt-4 text-xl text-gray-400">

Measure Everything. Improve Everything.

</p>

<div className="space-y-10 mt-12">

<CustomerAnalyticsDashboard/>

<CourseRevenueDashboard/>

<BookRevenueDashboard/>

<MarketplaceRevenueDashboard/>

<CountryRevenueDashboard/>

</div>

</section>

</main>

);

}
