import CapitalDisciplineSection from "../components/CapitalDisciplineSection";
import FreeIntroSection from "../components/FreeIntroSection";
import LegalNotice from "../components/LegalNotice";

export default function MENAPage() {
  return (
    <main>
      <h1>MENA</h1>

      <p>
        Focus on cross-border capital, real assets, family capital structures,
        and international participation.
      </p>

      <CapitalDisciplineSection />
      <FreeIntroSection />
      <LegalNotice />
    </main>
  );
}
