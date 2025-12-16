import HeroSection from './herosection';
import AppsSection from './appssection';
import BookSection from './booksection';
import CoursesSection from './coursessection';
import RotatingVideoSection from './rotatingvideosection';
import StorySection from './storysection';
import FooterSection from './footersection';

/* named exports (already used elsewhere) */
export {
  HeroSection,
  AppsSection,
  BookSection,
  CoursesSection,
  RotatingVideoSection,
  StorySection,
  FooterSection,
};

/* DEFAULT EXPORT — THIS IS WHAT WAS MISSING */
export default function Sections() {
  return (
    <>
      <HeroSection />
      <AppsSection />
      <BookSection />
      <CoursesSection />
      <RotatingVideoSection />
      <StorySection />
      <FooterSection />
    </>
  );
}
