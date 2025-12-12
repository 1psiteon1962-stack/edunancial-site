"use client";

import HeroSection from "@/components/sections/herosection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";
import StorySection from "@/components/sections/storysection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSection />
      <RotatingVideoSection />
      <StorySection />
      <BooksSection />
      <CoursesSection />
      <AppsSection />
    </div>
  );
}
