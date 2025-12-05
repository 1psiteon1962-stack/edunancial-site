"use client";

import React from "react";
import CoursesSection from "@/components/sections/coursessection";

export default function CoursesPage() {
  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col items-center">
      <div className="w-full max-w-6xl py-12 px-6">
        <h1 className="text-4xl font-bold mb-6">Courses</h1>
        <p className="text-lg mb-10">
          Our financial, business, and wealth-building courses appear here.  
          This page already supports adding video-based lessons without redesign.
        </p>

        <CoursesSection />

        <div className="mt-16 text-center text-gray-600">
          Video lessons & full course modules will be added here.
        </div>
      </div>
    </main>
  );
}
