import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import HomePageContent from "@/components/home/HomePageContent";
import { isLoggedIn } from "@/lib/auth";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_LONG_DESCRIPTION,
} from "@/lib/positioning";

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
  keywords: [
    "financial competency platform",
    "financial literacy membership",
    "real estate knowledge",
    "investment knowledge",
    "business competency",
    "AI financial coach",
    "practical financial knowledge",
  ],
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_LONG_DESCRIPTION,
    url: "https://www.edunancial.com",
    siteName: "Edunancial",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial financial competency learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_IDENTITY,
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  if (isLoggedIn()) {
    redirect("/dashboard");
  }

  return <HomePageContent />;
}
