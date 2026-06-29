import AIBanner from "./AIBanner";
import FeaturedCourses from "./FeaturedCourses";
import FundingBanner from "./FundingBanner";
import MarketplaceBanner from "./MarketplaceBanner";
import QuickActions from "./QuickActions";
import StartupBanner from "./StartupBanner";
import VoiceBanner from "./VoiceBanner";

export default function HomeSections(){

return(

<div className="space-y-10">

<QuickActions/>

<AIBanner/>

<FeaturedCourses/>

<MarketplaceBanner/>

<StartupBanner/>

<FundingBanner/>

<VoiceBanner/>

</div>

);

}
