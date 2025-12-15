import AppsSection from '@/components/sections/appssection';
import BooksSection from '@/components/sections/bookssection';
import CoursesSection from '@/components/sections/coursessec tion';
import HeroSection from '@/components/sections/herosection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AppsSection />
      <BooksSection />
      <CoursesSection />
    </>
  );
}
