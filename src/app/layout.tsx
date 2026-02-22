import type { Metadata } from "next";
import "./globals.css";
import PageViewTracker from "@/components/kpi/PageViewTracker";

export const metadata: Metadata = {
  title: "Edunancial",
  description: "Where Education and Financial Literacy Meet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
