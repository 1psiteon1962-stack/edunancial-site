import AIBanner from "./AIBanner";
import BusinessBuilderBanner from "./BusinessBuilderBanner";
import ContinueLearningBanner from "./ContinueLearningBanner";
import FeaturedBooks from "./FeaturedBooks";
import FeaturedCourses from "./FeaturedCourses";
import FeaturedDownloads from "./FeaturedDownloads";
import FeaturedPodcasts from "./FeaturedPodcasts";
import FeaturedProfessionals from "./FeaturedProfessionals";
import FeaturedVideos from "./FeaturedVideos";
import FundingBanner from "./FundingBanner";
import GoalCenter from "./GoalCenter";
import InvestorBanner from "./InvestorBanner";
import LatestNews from "./LatestNews";
import PlatformStats from "./PlatformStats";
import StartupTracker from "./StartupTracker";
import SuccessMetrics from "./SuccessMetrics";
import UpcomingEvents from "./UpcomingEvents";
import VoiceBanner from "./VoiceBanner";

export default function ExecutiveHome(){

return(

<div className="space-y-10">

<AIBanner/>

<PlatformStats/>

<SuccessMetrics/>

<FeaturedCourses/>

<FeaturedBooks/>

<FeaturedVideos/>

<FeaturedDownloads/>

<FeaturedPodcasts/>

<ContinueLearningBanner/>

<BusinessBuilderBanner/>

<StartupTracker/>

<InvestorBanner/>

<FeaturedProfessionals/>

<FundingBanner/>

<GoalCenter/>

<UpcomingEvents/>

<LatestNews/>

<VoiceBanner/>

</div>

);

}
