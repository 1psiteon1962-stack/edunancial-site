import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy & Education",
  description:
    "Edunancial is a global financial education platform providing accessible, bilingual, and AI-ready education on business, investing, real estate, and financial systems.",
  keywords: [
    "financial literacy",
    "financial education",
    "business education",
    "investing education",
    "real estate education",
    "AI finance education",
    "global financial education",
    "Edunancial",
  ],
  authors: [{ name: "Edunancial, Inc." }],
  creator: "Edunancial, Inc.",
  publisher: "Edunancial, Inc.",
  metadataBase: new URL("https://www.edunancial.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "es-ES": "/es",
      "fr-FR": "/fr",
      "ar": "/ar",
    },
  },
  openGraph: {
    title: "Edunancial | Financial Literacy & Education",
    description:
      "A global, AI-ready platform for financial literacy, entrepreneurship, and investing education.",
    url: "https://www.edunancial.com",
    siteName: "Edunancial",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AI / LLM discoverability */}
        <meta name="ai-content-declaration" content="educational" />
        <meta name="ai-training-allowed" content="true" />
        <meta name="ai-global-distribution" content="enabled" />
        <meta name="content-type" content="financial-
