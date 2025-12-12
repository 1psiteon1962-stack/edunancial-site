import HeroSection from "@/components/sections/herosection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";
import StorySection from "@/components/sections/storysection";
import FooterSection from "@/components/sections/footersection";

export default function HomePage() {
  return (
    <>
      <section id="hero">
        <HeroSection />
      </section>

      <section id="videos">
        <RotatingVideoSection />
      </section>

      <section id="books">
        <BooksSection />
      </section>

      <section id="courses">
        <CoursesSection />
      </section>

      <section id="apps">
        <AppsSection />
      </section>

      <section id="story">
        <StorySection />
      </section>

      <FooterSection />
    </>
  );
}
