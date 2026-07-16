import type { Metadata } from "next";

import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Edunancial",
  description:
    "Edunancial Privacy Policy — learn how we collect, use, and protect your personal information. Covers US (CCPA/CPRA), Canada (PIPEDA), and Quebec (Law 25) requirements.",
  alternates: {
    canonical: "https://www.edunancial.com/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
