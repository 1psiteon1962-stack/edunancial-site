import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 4 | Business",
  description: "Financial Competency Assessment - Business",
};

export default function AssessmentSectionFour() {
  const section = SECTIONS[3];
  return <AssessmentSectionClient section={section} />;
}
