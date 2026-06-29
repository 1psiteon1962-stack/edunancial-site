import AIWorkspaceBanner from "./AIWorkspaceBanner";
import BusinessHealth from "./BusinessHealth";
import CapitalCenter from "./CapitalCenter";
import EntrepreneurJourney from "./EntrepreneurJourney";
import FeaturedMarketplace from "./FeaturedMarketplace";
import FeaturedTools from "./FeaturedTools";
import PopularCourses from "./PopularCourses";
import ProfitCenter from "./ProfitCenter";

export default function BusinessOperatingSystem(){

return(

<div className="space-y-10">

<AIWorkspaceBanner/>

<PopularCourses/>

<FeaturedTools/>

<FeaturedMarketplace/>

<EntrepreneurJourney/>

<BusinessHealth/>

<ProfitCenter/>

<CapitalCenter/>

</div>

);

}
