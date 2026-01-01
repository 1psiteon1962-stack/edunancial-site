'use client';

import React from 'react';

/* ============================
   TYPES
============================ */

export type CurriculumStep = {
  title: string;
  description: string;
};

export interface CurriculumPathProps {
  /**
   * Region identifier (africa, asia, asia-emerging, asia-pacific, europe, mena, us)
   * Optional so pages without region do not break
   */
  region?: string;

  /**
   * Optional curriculum steps.
   * If omitted, region-based defaults are used.
   */
  steps?: CurriculumStep[];
}

/* ============================
   DEFAULT CURRICULUM BY REGION
============================ */

const REGION_DEFAULTS: Record<string, CurriculumStep[]> = {
  africa: [
    { title: 'Foundations', description: 'Basic financial literacy and entrepreneurship fundamentals.' },
    { title: 'Local Markets', description: 'Understanding regional commerce and informal economies.' },
    { title: 'Scaling', description: 'Formalization, cross-border trade, and capital access.' }
  ],
  asia: [
    { title: 'Efficiency', description: 'Process optimization and operational discipline.' },
    { title: 'Technology', description: 'Manufacturing, automation, and digital systems.' },
    { title: 'Expansion', description: 'Export models and multinational growth.' }
  ],
  'asia-emerging': [
    { title: 'Stability', description: 'Business foundations in fast-growing economies.' },
    { title: 'Capital Formation', description: 'Microfinance, SME funding, and partnerships.' },
    { title: 'Acceleration', description: 'Scaling into regional hubs.' }
  ],
  'asia-pacific': [
    { title: 'Governance', description: 'Corporate structure and regulatory alignment.' },
    { title: 'Innovation', description: 'Advanced services, IP, and finance.' },
    { title: 'Global Reach', description: 'Multinational execution.' }
  ],
  europe: [
    { title: 'Compliance', description: 'Regulatory and governance-driven business models.' },
    { title: 'Sustainability', description: 'Long-term enterprise and ESG alignment.' },
    { title: 'Integration', description: 'EU-wide expansion strategies.' }
  ],
  mena: [
    { title: 'Capital Strategy', description: 'Sovereign funds, family offices, and capital discipline.' },
    { title: 'Infrastructure', description: 'Energy, logistics, and state-linked enterprise.' },
    { title: 'Global Positioning', description: 'Cross-continental investment flows.' }
  ],
  us: [
    { title: 'Market Entry', description: 'Competitive positioning and legal structure.' },
    { title: 'Scale', description: 'Venture growth and institutional capital.' },
    { title: 'Exit', description: 'Liquidity events and long-term wealth.' }
  ]
};

/* ============================
   COMPONENT
============================ */

export default function CurriculumPath({
  region,
  steps
}: CurriculumPathProps) {
  const resolvedSteps =
    steps ??
    (region && REGION_DEFAULTS[region]) ??
    [];

  if (!resolvedSteps.length) {
    return null;
  }

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
        Curriculum Path
      </h2>

      <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
        {resolvedSteps.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <strong>{step.title}</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>
              {step.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
