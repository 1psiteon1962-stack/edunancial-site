"use client";

import { usePathname } from "next/navigation";
import EuropeEN from "./lang/en";
import EuropeFR from "./lang/fr";
import EuropeDE from "./lang/de";
import EuropeES from "./lang/es";

export default function EuropeContent() {
  const pathname = usePathname() ?? "/europe";

  if (pathname.startsWith("/fr")) return <EuropeFR />;
  if (pathname.startsWith("/de")) return <EuropeDE />;
  if (pathname.startsWith("/es")) return <EuropeES />;

  return <EuropeEN />;
}
