"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionDefinition } from "@/lib/assessment/questions";
import { saveAnswersForSection, StoredAnswers } from "@/lib/assessment/store";
import AssessmentProgressBar from "./AssessmentProgressBar";

interface AssessmentSectionClientProps {
  section: SectionDefinition;
}

export default function AssessmentSectionClient({
  section,
}: AssessmentSectionClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<StoredAnswers>({});

  const answeredCount = Object.keys(selected).length;
  const totalQuestions = section.questions.length;
  const allAnswered = answeredCount === totalQuestions;

  function handleSelect(questionId: string, label: "A" | "B" | "C" | "D") {
    setSelected((prev) => ({ ...prev, [questionId]: label }));
  }

  function handleContinue() {
    if (!allAnswered) return;
    saveAnswersForSection(selected);
    router.push(section.nextPath);
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">

        <AssessmentProgressBar currentSection={section.number} />

        <p className={`font-bold uppercase tracking-[0.45em] ${section.accentColor}`}>
          {section.subtitle}
        </p>

        <h1 className="mt-8 text-6xl font-black">{section.title}</h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">
          {section.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <span>{answeredCount} of {totalQuestions} answered</span>
          {allAnswered && (
            <span className="text-green-400 font-semibold">✓ Ready to continue</span>
          )}
        </div>

        <div className="mt-12 space-y-10">
          {section.questions.map((question, idx) => (
            <div
              key={question.id}
              className="rounded-2xl bg-slate-900 p-10"
            >
              <h2 className="text-4xl font-black">Question {idx + 1}</h2>
              <p className="mt-8 text-2xl leading-10">{question.text}</p>

              <div className="mt-10 space-y-4">
                {question.options.map((option) => {
                  const isSelected = selected[question.id] === option.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() => handleSelect(question.id, option.label)}
                      className={`w-full rounded-xl border p-6 text-left text-lg transition-colors duration-150 ${
                        isSelected
                          ? "border-blue-500 bg-blue-900/40 text-white"
                          : "border-slate-700 text-slate-200 hover:border-blue-500 hover:bg-slate-800"
                      }`}
                    >
                      <span className="mr-3 font-bold text-blue-400">
                        {option.label}.
                      </span>
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >
            Previous
          </button>

          <button
            onClick={handleContinue}
            disabled={!allAnswered}
            className={`rounded-xl px-8 py-4 text-lg font-bold transition-colors duration-200 ${
              allAnswered
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {section.number === 6 ? "View My Results →" : `Continue to Section ${section.number + 1} →`}
          </button>
        </div>

        {!allAnswered && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Please answer all {totalQuestions} questions to continue.
          </p>
        )}

      </section>
    </main>
  );
}
