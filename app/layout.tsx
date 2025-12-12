import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import FooterSection from "@/components/sections/footersection";

export const metadata: Metadata = {
  title: {
    default: "Edunancial | Financial Literacy & Education",
    template: "%s | Edunancial",
  },
  description:
    "Edunancial is a global financial literacy and education platform focused on real-world business, investing, and wealth-building knowledge.",
  applicationName: "Edunancial",
  authors: [{ name: "Edunancial" }],
  generator: "Next.js",
  keywords: [
    "financial literacy",
    "financial education",
    "investing education",
    "business education",
    "wealth building",
    "personal finance",
    "entrepreneurship",
    "Edunancial",
  ],
  creator: "Edunancial",
  publisher: "Edunancial",
  metadataBase: new URL("https://edunancial.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edunancial.com",
    siteName: "Edunancial",
    title: "Edunancial | Financial Literacy & Education",
    description:
      "Practical financial education for business owners, investors, and lifelong learners worldwide.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial – Financial Literacy & Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Education",
    description:
      "Practical financial education for business owners, investors, and lifelong learners worldwide.",
    images: ["/og-image.png"],
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <FooterSection />
      </body>
    </html>
  );
}
