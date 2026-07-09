"use client";

import { useEffect, useState } from "react";

import type { MotivationalQuote } from "@/lib/memberDashboard";

interface MotivationalQuoteRotatorProps {
  quotes: MotivationalQuote[];
}

export default function MotivationalQuoteRotator({
  quotes,
}: MotivationalQuoteRotatorProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveQuoteIndex((currentIndex) => (currentIndex + 1) % quotes.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [quotes]);

  if (quotes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-slate-300">
        New motivational insights will appear here soon.
      </div>
    );
  }

  const activeQuote = quotes[activeQuoteIndex];

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-950 p-6 shadow-lg shadow-blue-950/20">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
        Motivation
      </p>
      <blockquote className="mt-4 text-2xl font-semibold leading-relaxed text-white">
        “{activeQuote.quote}”
      </blockquote>
      <p className="mt-4 text-sm text-slate-300">{activeQuote.author}</p>
      <div className="mt-5 flex gap-2" aria-label="Quote rotation indicators">
        {quotes.map((quote, index) => (
          <span
            key={quote.quote}
            className={`h-2.5 w-2.5 rounded-full ${
              index === activeQuoteIndex ? "bg-yellow-400" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
