import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/lib/auth";
import { EDUNANCIAL_IDENTITY, EDUNANCIAL_LONG_DESCRIPTION } from "@/lib/positioning";

import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Edunancial | From Financial Literacy to Financial Intelligence",
  description: EDUNANCIAL_LONG_DESCRIPTION,
  keywords: [
    "financial intelligence platform",
    "financial literacy membership",
    "real estate knowledge",
    "investment knowledge",
    "business education",
    "AI financial coach",
    "practical financial knowledge",
  ],
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | From Financial Literacy to Financial Intelligence",
    description: EDUNANCIAL_LONG_DESCRIPTION,
    url: "https://www.edunancial.com",
    siteName: "Edunancial",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial financial literacy to financial intelligence platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | From Financial Literacy to Financial Intelligence",
    description: EDUNANCIAL_IDENTITY,
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  if (isLoggedIn()) {
    redirect("/dashboard");
  }

  return <HomePageClient />;
}
