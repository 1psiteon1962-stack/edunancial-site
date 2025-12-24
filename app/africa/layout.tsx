import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial Africa",
  description:
    "Edunancial Africa provides business literacy, capital awareness, and economic clarity for emerging and growth-stage entrepreneurs across the African continent.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AfricaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
