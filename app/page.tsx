// app/page.tsx
import HeroSection from "../components/sections/HeroSection";
import StorySection from "../components/sections/StorySection";
import AppsSection from "../components/sections/AppsSection";
import CoursesSection from "../components/sections/CoursesSection";
import RotatingVideosSection from "../components/sections/RotatingVideosSection";
import BooksSection from "../components/sections/BooksSection";
import FooterSection from "../components/sections/FooterSection";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <HeroSection />
      <StorySection />
      <AppsSection />
      <CoursesSection />
      <RotatingVideosSection />
      <BooksSection />
      <FooterSection />
    </main>
  );
}
