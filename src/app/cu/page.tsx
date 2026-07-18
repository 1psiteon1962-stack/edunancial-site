import type { Metadata } from "next";

import { hasCuAccess } from "@/lib/cu/auth";

import CUWorkbench from "./CUWorkbench";

export const metadata: Metadata = {
  title: "CU | Content Upload",
  description: "Isolated content upload workbench for Edunancial content loading.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CUPage() {
  const authenticated = await hasCuAccess();
  return <CUWorkbench authenticated={authenticated} />;
}
