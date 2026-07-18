import type { Metadata } from "next";

import ContentUploadWorkbench from "@/components/cu/ContentUploadWorkbench";

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
  return <ContentUploadWorkbench />;
}
