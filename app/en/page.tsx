// FILE: app/en/page.tsx

import HeroSection from "@/components/sections/herosection";
import AppsSection from "@/components/sections/appssection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessecti on";
import FooterSection from "@/components/sections/footersection";

export default function Page() {
  return (
    <>
      <HeroSection />
      <AppsSection />
      <BooksSection />
      <CoursesSection />
      <FooterSection />
    </>
  );
}
