import HeroSection from "@/components/sections/herosection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";
import StorySection from "@/components/sections/storysection";

export default function SpanishHomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <BooksSection />
      <CoursesSection />
      <AppsSection />
      <RotatingVideoSection />
      <StorySection />
    </main>
  );
}
