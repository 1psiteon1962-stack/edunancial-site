"use client";

// ─────────────────────────────────────────────────────────────
// LessonAICoach — Post-lesson Socratic AI coaching experience
//
// IMPORTANT GUARDRAIL: The AI Coach is designed to reinforce
// financial education concepts. It does NOT and MUST NOT make
// financial, legal, tax, or investment decisions or
// recommendations for members. All guidance is educational.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import type { AICoachConfig } from "@/lib/video-learning/types";

const GUARDRAIL_NOTICE =
  "The Edunancial AI Coach is a learning tool designed to reinforce " +
  "financial education concepts through guided questions. " +
  "It does not provide financial, legal, tax, or investment advice. " +
  "All financial decisions should be made with the guidance of qualified " +
  "licensed professionals based on your individual circumstances.";

interface LessonAICoachProps {
  lessonTitle: string;
  courseId: string;
  aiCoach?: AICoachConfig;
  suggestedNextLessonId?: string;
  /** Map of lesson id → title for displaying recommended lesson names */
  lessonTitles?: Record<string, string>;
}

type CoachPhase = "intro" | "question" | "summary";

export default function LessonAICoach({
  lessonTitle,
  courseId,
  aiCoach,
  suggestedNextLessonId,
  lessonTitles = {},
}: LessonAICoachProps) {
  const [phase, setPhase] = useState<CoachPhase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [readyToContinue, setReadyToContinue] = useState<boolean | null>(null);

  const questions = aiCoach?.socratiсQuestions ?? [];
  const recommended = aiCoach?.recommendedLessonIds ?? [];
  const enabled = aiCoach?.enabled !== false;

  if (!enabled) return null;

  const handleStart = () => setPhase("question");

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const updated = [...answers, currentAnswer.trim()];
    setAnswers(updated);
    setCurrentAnswer("");
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("summary");
    }
  };

  const handleSkipQuestion = () => {
    const updated = [...answers, ""];
    setAnswers(updated);
    setCurrentAnswer("");
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("summary");
    }
  };

  return (
    <div className="rounded-2xl border border-blue-800 bg-gradient-to-br from-blue-950 to-slate-950 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-blue-800 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="font-black text-lg text-blue-300">AI Learning Coach</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Reinforce your understanding of: <span className="text-white font-semibold">{lessonTitle}</span>
          </p>
        </div>
      </div>

      {/* Guardrail notice */}
      <div className="mx-6 mt-4 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-yellow-400 font-bold">⚠ Important: </span>
          {GUARDRAIL_NOTICE}
        </p>
      </div>

      {/* Intro phase */}
      {phase === "intro" && (
        <div className="px-6 py-6 space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            Great work completing this lesson! The AI Coach will ask you {questions.length} questions
            to help reinforce what you learned and encourage deeper thinking.
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✦</span>
              There are no wrong answers — this is a thinking exercise, not a test.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✦</span>
              Your responses stay on your device and are never stored.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✦</span>
              After the session the Coach will help you decide whether to continue or review.
            </li>
          </ul>
          {questions.length > 0 ? (
            <button
              onClick={handleStart}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 font-bold text-white text-sm"
            >
              Start AI Coaching Session →
            </button>
          ) : (
            <p className="text-slate-500 text-xs italic">
              AI Coach questions for this lesson are coming soon.
            </p>
          )}
        </div>
      )}

      {/* Question phase */}
      {phase === "question" && questions.length > 0 && (
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Question {currentQ + 1} of {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition ${
                    i < currentQ
                      ? "bg-blue-400"
                      : i === currentQ
                      ? "bg-blue-300"
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-white font-semibold text-base leading-relaxed">
            {questions[currentQ]}
          </p>

          <textarea
            rows={4}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer… take your time and think it through."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-blue-500 transition"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition px-5 py-2.5 font-bold text-white text-sm"
            >
              {currentQ + 1 < questions.length ? "Next Question →" : "Finish Session"}
            </button>
            <button
              onClick={handleSkipQuestion}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 transition px-5 py-2.5 text-slate-400 text-sm"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Summary phase */}
      {phase === "summary" && (
        <div className="px-6 py-6 space-y-6">
          <div>
            <p className="text-blue-300 font-black text-lg">Session Complete 🎉</p>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              You answered {answers.filter(Boolean).length} of {questions.length} questions.
              Reflecting on financial concepts is how knowledge becomes competency.
            </p>
          </div>

          {/* Readiness check */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-3">
            <p className="text-white font-semibold text-sm">
              Are you ready to move on, or would you like to review this lesson again?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setReadyToContinue(true)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition border ${
                  readyToContinue === true
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-green-600"
                }`}
              >
                ✅ Ready to continue
              </button>
              <button
                onClick={() => setReadyToContinue(false)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition border ${
                  readyToContinue === false
                    ? "bg-yellow-700 border-yellow-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-yellow-600"
                }`}
              >
                🔁 Review the lesson
              </button>
            </div>

            {readyToContinue === false && (
              <p className="text-sm text-yellow-300 leading-relaxed">
                No problem — reviewing is a sign of discipline. Watch the lesson again and come back when
                you feel confident in the material.
              </p>
            )}

            {readyToContinue === true && suggestedNextLessonId && (
              <div className="pt-2">
                <p className="text-sm text-green-300 mb-3">
                  Great! Here&apos;s your suggested next lesson:
                </p>
                <Link
                  href={`/courses/${courseId}/lessons/${suggestedNextLessonId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 transition px-5 py-2.5 font-bold text-white text-sm"
                >
                  {lessonTitles[suggestedNextLessonId]
                    ? lessonTitles[suggestedNextLessonId]
                    : "Next Lesson"}{" "}
                  →
                </Link>
              </div>
            )}
          </div>

          {/* Recommended lessons */}
          {recommended.length > 0 && (
            <div>
              <p className="text-sm font-bold text-slate-400 mb-3">Recommended lessons:</p>
              <div className="flex flex-wrap gap-2">
                {recommended.map((id) => (
                  <Link
                    key={id}
                    href={`/courses/${courseId}/lessons/${id}`}
                    className="rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-600 transition px-4 py-2 text-sm text-slate-300 font-semibold"
                  >
                    {lessonTitles[id] ?? id}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
