// app/page.tsx

import {
  HeroSection,
  StorySection,
  CoursesSection,
  AppsSection,
  RotatingVideoSection,
  BookSection,
  FooterSection,
} from "@/components/sections";

export default function Page() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <CoursesSection />
      <AppsSection />
      <RotatingVideoSection />
      <BookSection />
      <FooterSection />
    </>
  );
}
