"use client";

import type { CalculatorRecommendation } from "@/lib/ai-tutor/types";
import Link from "next/link";

interface Props {
  calculators: CalculatorRecommendation[];
}

export default function RecommendedCalculators({ calculators }: Props) {
  if (calculators.length === 0) return null;

  return (
    <section aria-labelledby="calculators-heading">
      <h2
        id="calculators-heading"
        className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-400"
      >
        Recommended Calculators
      </h2>

      <ul className="space-y-2">
        {calculators.map((calc) => (
          <li key={calc.calculatorId}>
            <Link
              href={calc.url}
              className="group flex items-center gap-3 rounded-lg bg-slate-800/60 px-4 py-2.5 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label={`Open calculator: ${calc.title}`}
            >
              <span aria-hidden="true" className="text-blue-400 text-lg">🧮</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white group-hover:text-yellow-300 transition">
                  {calc.title}
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">{calc.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
