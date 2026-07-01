import GlobalAdministrationDashboard from "./GlobalAdministrationDashboard";
import RegionManagement from "./RegionManagement";
import CountryActivation from "./CountryActivation";
import RegionalAdministrators from "./RegionalAdministrators";

export default function GlobalOperationsCenter(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-6xl font-black">

Global Operations Center

</h1>

<p className="mt-4 text-xl text-gray-400">

Manage Every Region. Monitor Every Country.

</p>

<div className="space-y-10 mt-12">

<GlobalAdministrationDashboard/>

<RegionManagement/>

<CountryActivation/>

<RegionalAdministrators/>

</div>

</section>

</main>

);

}
