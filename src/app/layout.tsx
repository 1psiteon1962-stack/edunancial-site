import type { Metadata } from "next";
import "./globals.css";

/**
 * FINAL FIX:
 * Use RELATIVE PATH based on YOUR actual structure
 */
import PageViewTracker from "../components/kpi/PageViewTracker";

export const metadata: Metadata = {
  title: "Edunancial",
  description: "Financial education platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
