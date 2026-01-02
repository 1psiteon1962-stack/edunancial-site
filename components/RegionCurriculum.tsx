import React from "react";

export interface Pricing {
  currency: string;
  monthly: number;
  annual: number;
  quarterly?: number;
  lifetime?: number;
  enterprise?: string;
}

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
  cta: string;
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
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">
        {content.title}
      </h1>

      <p className="mb-6 text-lg">
        {content.description}
      </p>

      <h2 className="text-xl font-semibold mb-2">
        Curriculum
      </h2>
      <ul className="list-disc ml-6 space-y-2 mb-8">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">
        Pricing
      </h2>
      <div className="border rounded-lg p-4 mb-6">
        <p>
          Monthly: {content.pricing.currency}
          {content.pricing.monthly}
        </p>
        <p>
          Annual: {content.pricing.currency}
          {content.pricing.annual}
        </p>
        {content.pricing.quarterly && (
          <p>
            Quarterly: {content.pricing.currency}
            {content.pricing.quarterly}
          </p>
        )}
        {content.pricing.lifetime && (
          <p>
            Lifetime: {content.pricing.currency}
            {content.pricing.lifetime}
          </p>
        )}
        {content.pricing.enterprise && (
          <p>Enterprise: {content.pricing.enterprise}</p>
        )}
      </div>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        {content.cta}
      </button>
    </main>
  );
}
