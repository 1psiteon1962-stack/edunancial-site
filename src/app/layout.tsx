import type { Metadata } from "next";
import "./globals.css";

/**
 * CRITICAL FIX:
 * Use RELATIVE PATH (NO @ alias)
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
