import type { Metadata } from "next";

import StudentSuccessPageClient from "./StudentSuccessPageClient";

export const metadata: Metadata = {
  title: "Student Success | Edunancial",
  description:
    "Track your progress, view completed courses, and earn certificates on your financial competency journey.",
};

export default function StudentSuccessPage() {
  return <StudentSuccessPageClient />;
}
