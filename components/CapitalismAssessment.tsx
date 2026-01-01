'use client';

import { useState } from "react";

const questions = [
  { text: "My income depends entirely on my time.", level: 1 },
  { text: "I generate income independently but must stay involved daily.", level: 2 },
  { text: "I have systems that operate without me present.", level: 3 },
  { text: "I control assets or IP others depend on.", level: 4 },
  { text: "I design structures that allocate capital or opportunity.", level: 5 },
];

export default function CapitalismAssessment() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Capitalism Position Assessment</h2>

      <div className="space-y-4">
        {questions.map(q => (
          <button
            key={q.level}
            onClick={() => setSelectedLevel(q.level)}
            className="w-full text-left border p-4 rounded hover:bg-gray-100"
          >
            {q.text}
          </button>
        ))}
      </div>

      {selectedLevel && (
        <div className="mt-8 p-6 border rounded bg-white">
          <h3 className="text-xl font-semibold mb-2">
            You are currently at Level {selectedLevel}
          </h3>
          <p>
            Edunancial provides structural literacy to help you move to the
            next level before consolidation occurs.
          </p>
        </div>
      )}
    </section>
  );
}
