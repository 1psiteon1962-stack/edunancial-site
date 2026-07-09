import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 1 | Personal Finance",
  description: "Financial Competency Assessment - Personal Finance",
};

export default function AssessmentSectionOne() {
  const section = SECTIONS[0];
  return <AssessmentSectionClient section={section} />;
}
