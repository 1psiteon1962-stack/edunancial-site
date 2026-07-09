import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 5 | Risk Management",
  description: "Financial Competency Assessment - Risk Management",
};

export default function AssessmentSectionFive() {
  const section = SECTIONS[4];
  return <AssessmentSectionClient section={section} />;
}
