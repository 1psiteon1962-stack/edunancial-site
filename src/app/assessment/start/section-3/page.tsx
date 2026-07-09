import AssessmentSectionClient from "@/components/assessment/AssessmentSectionClient";
import { SECTIONS } from "@/lib/assessment/questions";

export const metadata = {
  title: "Section 3 | Real Estate",
  description: "Financial Competency Assessment - Real Estate",
};

export default function AssessmentSectionThree() {
  const section = SECTIONS[2];
  return <AssessmentSectionClient section={section} />;
}
