'use client';

import React from 'react';
import { regionContent, RegionKey, Language, RegionCurriculumContent } from '@/lib/regionContent';

interface RegionCurriculumProps {
  regionKey: RegionKey;
  lang: Language;
  content?: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: RegionCurriculumProps) {
  const resolved =
    content ??
    regionContent[regionKey]?.[lang] ??
    regionContent[regionKey]?.en;

  if (!resolved) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Content coming soon</h1>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">{resolved.title}</h1>
        <p className="text-gray-600 mt-2">{resolved.description}</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
        <ul className="list-disc ml-6 space-y-1">
          {resolved.curriculum.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded">
            <div className="font-bold">Monthly</div>
            <div>
              {resolved.pricing.currency} {resolved.pricing.monthly}
            </div>
          </div>
          <div className="border p-4 rounded">
            <div className="font-bold">Annual</div>
            <div>
              {resolved.pricing.currency} {resolved.pricing.annual}
            </div>
          </div>
          <div className="border p-4 rounded">
            <div className="font-bold">Lifetime</div>
            <div>
              {resolved.pricing.currency} {resolved.pricing.lifetime}
            </div>
          </div>
        </div>
      </section>

      <section>
        <button className="bg-black text-white px-6 py-3 rounded">
          Continue to Enrollment
        </button>
      </section>
    </main>
  );
}
