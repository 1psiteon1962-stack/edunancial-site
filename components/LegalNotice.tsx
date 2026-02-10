import { LEGAL_FRAMEWORK } from "../lib/legalContent";

export default function LegalNotice() {
  return (
    <section>
      <p>{LEGAL_FRAMEWORK.platformNature}</p>
      <p>{LEGAL_FRAMEWORK.noAdvice}</p>
      <p>{LEGAL_FRAMEWORK.userResponsibility}</p>
      <p>{LEGAL_FRAMEWORK.jurisdiction}</p>
    </section>
  );
}
