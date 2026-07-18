import type { Metadata } from "next";

import ExecutiveErrorLogger from "@/components/executive/ExecutiveErrorLogger";

export const metadata: Metadata = {
  title: "Edunancial Executive",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ExecutiveErrorLogger />
      {children}
    </>
  );
}
