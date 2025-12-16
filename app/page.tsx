import {
  HeroSection,
  StorySection,
  CoursesSection,
  AppsSection,
  RotatingVideoSection,
  BookSection,
  FooterSection,
} from "../components/sections";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <CoursesSection />
      <AppsSection />
      <RotatingVideoSection />
      <BookSection />
      <FooterSection />
    </main>
  );
}
