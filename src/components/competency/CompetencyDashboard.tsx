import MissionCenter from "./MissionCenter";
import DailyChallenge from "./DailyChallenge";
import WeeklyCompetencyReport from "./WeeklyCompetencyReport";
import CompetencyLeaderboard from "./CompetencyLeaderboard";

export default function CompetencyDashboard(){

return(

<main className="min-h-screen bg-[#08101f]">

<div className="mx-auto max-w-7xl space-y-10 px-6 py-12">

<MissionCenter/>

<DailyChallenge/>

<WeeklyCompetencyReport/>

<CompetencyLeaderboard/>

</div>

</main>

);

}
