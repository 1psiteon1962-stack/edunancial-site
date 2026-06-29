import AIBanner from "./AIBanner";
import ContinueLearningBanner from "./ContinueLearningBanner";
import FeaturedBooks from "./FeaturedBooks";
import FeaturedCourses from "./FeaturedCourses";
import FeaturedProfessionals from "./FeaturedProfessionals";
import FeaturedVideos from "./FeaturedVideos";
import FinancialCalculatorBanner from "./FinancialCalculatorBanner";
import FundingBanner from "./FundingBanner";
import MarketplaceBanner from "./MarketplaceBanner";
import NewsletterSignup from "./NewsletterSignup";
import PlatformStats from "./PlatformStats";
import StartupBanner from "./StartupBanner";
import Testimonials from "./Testimonials";
import UpcomingLiveClasses from "./UpcomingLiveClasses";
import VoiceBanner from "./VoiceBanner";

export default function HomePageLayout(){

return(

<div className="space-y-10">

<AIBanner/>

<PlatformStats/>

<FeaturedCourses/>

<FeaturedBooks/>

<FeaturedVideos/>

<ContinueLearningBanner/>

<MarketplaceBanner/>

<FeaturedProfessionals/>

<StartupBanner/>

<FundingBanner/>

<FinancialCalculatorBanner/>

<UpcomingLiveClasses/>

<Testimonials/>

<NewsletterSignup/>

<VoiceBanner/>

</div>

);

}
