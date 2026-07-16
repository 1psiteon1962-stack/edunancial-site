"use client";

import { usePathname } from "next/navigation";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import DetectedPreferencesBanner from "@/components/international/DetectedPreferencesBanner";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminWorkspace = pathname.startsWith("/admin");

  if (isAdminWorkspace) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <DetectedPreferencesBanner />
      {children}
      <Footer />
    </>
  );
}
