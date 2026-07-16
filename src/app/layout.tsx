import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import DetectedPreferencesBanner from "@/components/international/DetectedPreferencesBanner";
import { InternationalPreferencesProvider } from "@/components/international/InternationalPreferencesProvider";
import { Providers } from "@/components/Providers";
import { resolveSeoAlternates } from "@/lib/international/global-regional-architecture";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_LONG_DESCRIPTION,
} from "@/lib/positioning";

const siteUrl = "https://www.edunancial.com";
const languageAlternates = resolveSeoAlternates({ canonicalPath: "/" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    template: "%s | Edunancial",
  },
  description: EDUNANCIAL_LONG_DESCRIPTION,
  keywords: [
    "financial literacy",
    "financial competency",
    "financial literacy platform",
    "financial competency platform",
    "real estate knowledge",
    "investment knowledge",
    "business competency",
    "wealth-building skills",
    "entrepreneurship knowledge",
    "edunancial",
  ],
  authors: [{ name: "Edunancial", url: siteUrl }],
  creator: "Edunancial",
  publisher: "Edunancial",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Edunancial",
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_LONG_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial — Financial Literacy & Competency Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_IDENTITY,
    images: ["/og-image.png"],
    creator: "@edunancial",
    site: "@edunancial",
  },
  alternates: {
    canonical: siteUrl,
    languages: languageAlternates,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? undefined,
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edunancial",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: EDUNANCIAL_LONG_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`,
    },
    areaServed: ["US", "CA"],
    knowsAbout: [
      "Financial Literacy",
      "Financial Competency",
      "Real Estate Knowledge",
      "Investment Knowledge",
      "Business Competency",
      "Entrepreneurship",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-[#08101f] text-white">
        <Providers>
          <InternationalPreferencesProvider>
            <AnnouncementBar />
            <Navbar />
            <DetectedPreferencesBanner />
            {children}
            <Footer />
          </InternationalPreferencesProvider>
        </Providers>
      </body>
    </html>
  );
}
