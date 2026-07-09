import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 2 | Investing",
  description: "Financial Competency Assessment - Investing",
};

export default function AssessmentSectionTwo() {
  const section = SECTIONS[1];
  return <AssessmentSectionClient section={section} />;
}
