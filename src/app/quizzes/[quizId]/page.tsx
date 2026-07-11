"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { quizzes, courses } from "@/data/course-platform";

interface Props {
  params: Promise<{ quizId: string }>;
}

type QuizState = "intro" | "active" | "result";

export default function QuizPage({ params }: Props) {
  const { quizId } = use(params);
  const quiz = quizzes[quizId];
  if (!quiz) notFound();

  const course = quiz.courseId ? courses[quiz.courseId] : null;

  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;

  const correctCount = answers.filter(
    (a, i) => a === quiz.questions[i].correctIndex
  ).length;
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  }

  function handleNext() {
    setSelected(null);
    setShowExplanation(false);
    if (isLast) {
      setState("result");
    } else {
      setCurrentQ((q) => q + 1);
    }
  }

  function handleRestart() {
    setAnswers(Array(quiz.questions.length).fill(null));
    setSelected(null);
    setShowExplanation(false);
    setCurrentQ(0);
    setState("intro");
  }

  if (state === "intro") {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-10 text-center">
            <span className="text-5xl">🧠</span>
            <h1 className="mt-4 text-3xl font-black">{quiz.title}</h1>
            {course && (
              <p className="mt-2 text-slate-400 text-sm">Part of: {course.title}</p>
            )}
            <div className="mt-8 flex justify-center gap-8 text-slate-300">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{quiz.questions.length}</p>
                <p className="text-xs text-slate-400 mt-1">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{quiz.passingScore}%</p>
                <p className="text-xs text-slate-400 mt-1">Passing Score</p>
              </div>
            </div>
            <p className="mt-6 text-slate-300 text-sm">
              Select the best answer for each question. Your score will be shown at the end.
            </p>
            <button
              onClick={() => setState("active")}
              className="mt-8 w-full rounded-xl bg-purple-600 py-4 font-black text-lg text-white hover:bg-purple-500 transition"
            >
              Start Quiz
            </button>
            {course && (
              <Link href={`/courses/${course.id}`} className="mt-3 block text-sm text-slate-400 hover:text-white">
                ← Back to Course
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (state === "active") {
    const progress = ((currentQ + 1) / quiz.questions.length) * 100;
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-start justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentQ + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-purple-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
            <p className="text-lg font-black leading-relaxed">{question.question}</p>

            <div className="mt-6 space-y-3">
              {question.options.map((opt, idx) => {
                let style = "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700";
                if (selected !== null) {
                  if (idx === question.correctIndex) {
                    style = "bg-green-900 border border-green-600 text-green-300";
                  } else if (idx === selected && selected !== question.correctIndex) {
                    style = "bg-red-900 border border-red-600 text-red-300";
                  } else {
                    style = "bg-slate-800 border border-slate-700 text-slate-500";
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left rounded-xl px-5 py-4 font-medium transition ${style}`}
                  >
                    <span className="font-black mr-3 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 rounded-xl bg-slate-800 border border-slate-700 p-5">
                <p className="text-sm font-black text-yellow-400 mb-2">
                  {selected === question.correctIndex ? "✅ Correct!" : "❌ Incorrect"}
                </p>
                <p className="text-sm text-slate-300">{question.explanation}</p>
              </div>
            )}

            {selected !== null && (
              <button
                onClick={handleNext}
                className="mt-6 w-full rounded-xl bg-purple-600 py-4 font-black text-white hover:bg-purple-500 transition"
              >
                {isLast ? "See Results" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Results
  return (
    <main className="min-h-screen bg-[#08101f] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-10 text-center">
          <span className="text-5xl">{passed ? "🏆" : "📚"}</span>
          <h1 className="mt-4 text-3xl font-black">{passed ? "You Passed!" : "Keep Studying"}</h1>
          <p className="mt-2 text-slate-400">{quiz.title}</p>

          <div className="mt-8">
            <div className={`text-6xl font-black ${passed ? "text-green-400" : "text-red-400"}`}>
              {score}%
            </div>
            <p className="text-slate-400 mt-2">
              {correctCount} / {quiz.questions.length} correct · Passing score: {quiz.passingScore}%
            </p>
          </div>

          {/* Score bar */}
          <div className="mt-6 h-3 w-full rounded-full bg-slate-800">
            <div
              className={`h-3 rounded-full ${passed ? "bg-green-500" : "bg-red-500"} transition-all`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Per-question review */}
          <div className="mt-8 text-left space-y-3">
            {quiz.questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-3 text-sm">
                <span className={answers[i] === q.correctIndex ? "text-green-400" : "text-red-400"}>
                  {answers[i] === q.correctIndex ? "✅" : "❌"}
                </span>
                <span className="text-slate-300">{q.question}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {passed && course && (
              <Link
                href="/my-certificates"
                className="w-full rounded-xl bg-yellow-500 py-4 font-black text-black hover:bg-yellow-400 transition"
              >
                🎓 View My Certificates
              </Link>
            )}
            <button
              onClick={handleRestart}
              className="w-full rounded-xl bg-slate-800 border border-slate-600 py-3 font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              Retake Quiz
            </button>
            {course && (
              <Link
                href={`/courses/${course.id}`}
                className="block text-sm text-slate-400 hover:text-white"
              >
                ← Back to Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
