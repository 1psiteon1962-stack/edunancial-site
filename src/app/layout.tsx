import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial",
  description: "Financial Literacy for Ordinary People",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
