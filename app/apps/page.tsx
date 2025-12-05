"use client";

import React from "react";
import AppsSection from "@/components/sections/appssection";

export default function AppsPage() {
  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col items-center">
      <div className="w-full max-w-6xl py-12 px-6">
        <h1 className="text-4xl font-bold mb-6">Apps</h1>
        <p className="text-lg mb-10">
          Explore Edunancial’s digital tools — calculators, analyzers, planners, and learning apps.
        </p>

        <AppsSection />

        <div className="mt-16 text-center text-gray-600">
          Additional AI-powered tools are under development.
        </div>
      </div>
    </main>
  );
}
