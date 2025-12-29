import CapitalDisciplineSection from "../components/CapitalDisciplineSection";
import FreeIntroSection from "../components/FreeIntroSection";
import LegalNotice from "../components/LegalNotice";

export default function LatAmPage() {
  return (
    <main>
      <h1>Latin America</h1>

      <p>
        Emphasis on entrepreneurship, remittances, real assets, and cross-border
        participation.
      </p>

      <CapitalDisciplineSection />
      <FreeIntroSection />
      <LegalNotice />
    </main>
  );
}
