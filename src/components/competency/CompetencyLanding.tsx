import FinancialCompetencyHero from "./FinancialCompetencyHero";
import CompetencyJourney from "./CompetencyJourney";
import RedWhiteBlueCompetency from "./RedWhiteBlueCompetency";
import EconomicCompetency from "./EconomicCompetency";

export default function CompetencyLanding(){

return(

<main className="min-h-screen bg-[#08101f]">

<div className="mx-auto max-w-7xl space-y-10 px-6 py-12">

<FinancialCompetencyHero/>

<CompetencyJourney/>

<RedWhiteBlueCompetency/>

<EconomicCompetency/>

</div>

</main>

);

}
