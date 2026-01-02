import React from "react";

export interface RegionCurriculumContent {
  title: string;
  description?: string;
  curriculum: string[];
  pricing?: {
    label: string;
    amount: string;
    cadence?: string;
  }[];
}

interface RegionCurriculumProps {
  regionKey: string;
  lang: string;
  content: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: RegionCurriculumProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {content.title}
      </h1>

      {content.description && (
        <p className="text-gray-700 mb-6">
          {content.description}
        </p>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Curriculum
        </h2>
        <ul className="list-disc ml-6 space-y-1">
          {content.curriculum.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {content.pricing && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Pricing
          </h2>
          <ul className="space-y-2">
            {content.pricing.map(
              (
                tier: {
                  label: string;
                  amount: string;
                  cadence?: string;
                },
                i: number
              ) => (
                <li
                  key={i}
                  className="border rounded p-3"
                >
                  <strong>{tier.label}</strong>:{" "}
                  {tier.amount}
                  {tier.cadence ? ` / ${tier.cadence}` : ""}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
