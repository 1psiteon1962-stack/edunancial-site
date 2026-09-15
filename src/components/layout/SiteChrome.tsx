"use client";

import { usePathname } from "next/navigation";

import AILearningCoachWidget from "@/components/ai-learning/AILearningCoachWidget";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import DetectedPreferencesBanner from "@/components/international/DetectedPreferencesBanner";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminWorkspace = pathname.startsWith("/admin");
  // Lesson URLs use /curriculum/{track}/{level}/{lesson-id}. Keep the coach out
  // of course listings, marketing pages, dashboards, and every non-lesson page.
  const isLessonPage = /^\/curriculum\/[^/]+\/l\d+\/[^/]+\/?$/i.test(pathname);

  if (isAdminWorkspace) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <DetectedPreferencesBanner />
      {children}
      {isLessonPage ? <AILearningCoachWidget /> : null}
      <Footer />
    </>
  );
}
