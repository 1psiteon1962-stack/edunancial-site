import CapitalDisciplineSection from "../components/CapitalDisciplineSection";
import FreeIntroSection from "../components/FreeIntroSection";
import LegalNotice from "../components/LegalNotice";

export default function AfricaPage() {
  return (
    <main>
      <h1>Africa</h1>

      <p>
        Focus areas include cross-border capital, infrastructure, informal-to-
        formal systems, and long-term ownership strategies.
      </p>

      <CapitalDisciplineSection />
      <FreeIntroSection />
      <LegalNotice />
    </main>
  );
}
