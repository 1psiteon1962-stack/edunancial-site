"use client";

import React from "react";

// ===== IMPORT SECTIONS =====
import HeroSection from "@/components/sections/herosection";
import StorySection from "@/components/sections/storysection";
import BooksSection from "@/components/sections/bookssection";
import CoursesSection from "@/components/sections/coursessection";
import AppsSection from "@/components/sections/appssection";
import RotatingVideoSection from "@/components/sections/rotatingvideosection";
import FooterSection from "@/components/sections/footersection";

// ===== PAGE CONTAINER =====
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full overflow-x-hidden bg-white text-black">

      {/* HERO SECTION */}
      <section className="w-full">
        <HeroSection />
      </section>

      {/* STORY SECTION */}
      <section className="w-full">
        <StorySection />
      </section>

      {/* BOOKS SECTION */}
      <section className="w-full">
        <BooksSection />
      </section>

      {/* COURSES SECTION */}
      <section className="w-full">
        <CoursesSection />
      </section>

      {/* APPS SECTION */}
      <section className="w-full">
        <AppsSection />
      </section>

      {/* ROTATING VIDEO SECTION */}
      <section className="w-full">
        <RotatingVideoSection />
      </section>

      {/* FOOTER */}
      <section className="w-full">
        <FooterSection />
      </section>

    </main>
  );
}
