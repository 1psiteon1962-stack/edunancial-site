import CountryCard from "./CountryCard";
import CountryDashboard from "./CountryDashboard";
import RegionSelector from "./RegionSelector";

export default function GlobalExpansionDashboard(){

return(

<div className="space-y-8">

<RegionSelector/>

<CountryDashboard/>

<div className="grid lg:grid-cols-3 gap-6">

<CountryCard/>

<CountryCard/>

<CountryCard/>

</div>

</div>

);

}
