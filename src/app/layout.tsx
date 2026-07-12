import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import DetectedPreferencesBanner from "@/components/international/DetectedPreferencesBanner";
import { InternationalPreferencesProvider } from "@/components/international/InternationalPreferencesProvider";
import { Providers } from "@/components/Providers";

const siteUrl = "https://www.edunancial.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edunancial | Financial Literacy & Financial Competency",
    template: "%s | Edunancial",
  },
  description:
    "Edunancial helps individuals, families, entrepreneurs, and business owners build financial competency through real estate, paper assets, and business education. North America's financial education platform.",
  keywords: [
    "financial literacy",
    "financial competency",
    "financial education",
    "real estate investing",
    "business education",
    "investing courses",
    "financial freedom",
    "North America",
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
    title: "Edunancial | Financial Literacy & Financial Competency",
    description:
      "Build financial competency through real estate, paper assets, and business education. Serving individuals, families, and entrepreneurs across North America.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Edunancial — Financial Literacy & Competency Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Financial Competency",
    description:
      "Build financial competency through real estate, paper assets, and business education.",
    images: ["/og-image.svg"],
    creator: "@edunancial",
    site: "@edunancial",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? undefined,
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Edunancial",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "Edunancial is a North American financial literacy and competency platform helping individuals, families, entrepreneurs, and business owners build wealth through real estate, paper assets, and business education.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`,
    },
    areaServed: ["US", "CA"],
    knowsAbout: [
      "Financial Literacy",
      "Financial Competency",
      "Real Estate Investing",
      "Business Education",
      "Stock Market Investing",
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
