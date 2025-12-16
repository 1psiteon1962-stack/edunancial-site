// app/page.tsx

import {
  HeroSection,
  StorySection,
  CoursesSelection,
  AppsSection,
  RotatingVideoSection,
  BookSection,
  FooterSection,
} from '@/components/sections';

export default function Page() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <CoursesSelection />
      <AppsSection />
      <RotatingVideoSection />
      <BookSection />
      <FooterSection />
    </>
  );
}
