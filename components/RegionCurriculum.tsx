import React from "react";

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    amount: number;
    interval: string;
  };
}

interface RegionCurriculumProps {
  regionKey: string;
  lang: string;
  content?: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: RegionCurriculumProps) {
  if (!content) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Curriculum Coming Soon
        </h1>
        <p>
          Content for region <strong>{regionKey}</strong> (
          <strong>{lang}</strong>) is being prepared.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p className="text-gray-600 mt-2">{content.description}</p>
      </header>

      <div>
        <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
        <ul className="list-disc ml-6 space-y-1">
          {content.curriculum.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Pricing</h2>
        <p className="text-lg">
          {content.pricing.currency}
          {content.pricing.amount} / {content.pricing.interval}
        </p>
        <button className="mt-4 px-6 py-3 bg-black text-white rounded">
          Continue
        </button>
      </div>
    </section>
  );
}
