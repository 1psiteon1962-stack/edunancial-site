import type { Metadata } from "next";

import AdminErrorLogger from "@/components/admin/AdminErrorLogger";

export const metadata: Metadata = {
  title: "Edunancial Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminErrorLogger />
      {children}
    </>
  );
}
