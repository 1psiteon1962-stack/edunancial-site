import HeroSection from "@/components/sections/herosection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";
import StorySection from "@/components/sections/storysection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";
import FooterSection from "@/components/sections/footersection";

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* HERO */}
      <HeroSection />

      {/* VIDEO / VISUAL INTRO */}
      <RotatingVideoSection />

      {/* STORY / MISSION */}
      <StorySection />

      {/* BOOKS */}
      <section id="books">
        <BooksSection />
      </section>

      {/* COURSES */}
      <section id="courses">
        <CoursesSection />
      </section>

      {/* APPS */}
      <section id="apps">
        <AppsSection />
      </section>

      {/* FOOTER */}
      <FooterSection />
    </main>
  );
}
