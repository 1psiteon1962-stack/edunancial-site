import type { Metadata } from "next";

import ExecutiveNav from "@/components/executive/ExecutiveNav";

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
    <div className="min-h-screen bg-[#08101f] text-white">
      <ExecutiveNav />
      {children}
    </div>
  );
}
