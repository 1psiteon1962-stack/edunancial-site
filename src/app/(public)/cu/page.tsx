import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CU | Edunancial",
  description: "Temporary emergency production content upload workbench.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CuPage() {
  redirect("/admin/content/upload");
}
