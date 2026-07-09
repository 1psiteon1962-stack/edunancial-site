import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 6 | Financial Competency Profile",
  description: "Financial Competency Assessment - Final Section",
};

export default function AssessmentSectionSix() {
  const section = SECTIONS[5];
  return <AssessmentSectionClient section={section} />;
}
