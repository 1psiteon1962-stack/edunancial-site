"use client";

import { useState } from "react";
import { LEVELS, levelQuestions } from "../../lib/levelsdata";
import { calculateLevel } from "../../lib/scoring";

export default function EdunancialLevelsApp() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [level, setLevel] = useState<number | null>(null);

  function answer(weight: number) {
    setAnswers([...answers, weight]);
    setStep(step + 1);
  }

  function submit() {
    setLevel(calculateLevel(answers));
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edunancial Levels™</h1>

      {!level && step < levelQuestions.length && (
        <div>
          <p className="mb-3">{levelQuestions[step].text}</p>
          {levelQuestions[step].options.map((o, i) => (
            <button
              key={i}
              onClick={() => answer(o.weight)}
              className="block w-full mb-2 p-2 border rounded"
            >
              {o.text}
            </button>
          ))}
        </div>
      )}

      {!level && step === levelQuestions.length && (
        <button
          onClick={submit}
          className="mt-4 p-2 bg-black text-white rounded"
        >
          View My Orientation
        </button>
      )}

      {level && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">
            Orientation: Level {level} — {LEVELS[level].name}
          </h2>
          <p className="mt-2">{LEVELS[level].desc}</p>

          <p className="text-xs mt-4 opacity-70">
            This is a self-directed financial literacy orientation tool.
            It is not advice, certification, or a recommendation.
          </p>
        </div>
      )}
    </div>
  );
}
