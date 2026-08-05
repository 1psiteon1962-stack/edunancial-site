import type { Metadata } from "next";

import SuccessStoriesPageClient from "./SuccessStoriesPageClient";

export const metadata: Metadata = {
  title: "Success Stories | Edunancial",
  description:
    "Real progress from real members — students, families, entrepreneurs, and professionals building practical financial competency.",
};

export default function SuccessStoriesPage() {
  return <SuccessStoriesPageClient />;
}
