import HeroSection from "@/components/sections/herosection";
import StorySection from "@/components/sections/storysection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <BooksSection />
      <CoursesSection />
      <AppsSection />
      <RotatingVideoSection />
    </>
  );
}
