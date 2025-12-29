import CapitalDisciplineSection from "../components/CapitalDisciplineSection";
import FreeIntroSection from "../components/FreeIntroSection";
import LegalNotice from "../components/LegalNotice";

export default function EuropePage() {
  return (
    <main>
      <h1>Europe</h1>

      <p>
        Coverage includes regulated markets, business ownership, and
        cross-border capital structures.
      </p>

      <CapitalDisciplineSection />
      <FreeIntroSection />
      <LegalNotice />
    </main>
  );
}
