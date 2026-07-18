import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial Executive",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
