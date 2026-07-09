"use client";

import { useState } from "react";
import Link from "next/link";
import type { MemberContext, CourseRecommendation, CalculatorRecommendation, LearningPath } from "@/lib/ai-tutor/types";
import AIChatInterface from "./AIChatInterface";
import LearningPathPanel from "./LearningPathPanel";
import RecommendedCourses from "./RecommendedCourses";
import RecommendedCalculators from "./RecommendedCalculators";
import SuggestedQuestions from "./SuggestedQuestions";

interface Props {
  memberContext: MemberContext;
  recommendedCourses: CourseRecommendation[];
  recommendedCalculators: CalculatorRecommendation[];
  learningPath: LearningPath;
  suggestedQuestions: string[];
}

export default function AITutorDashboard({
  memberContext,
  recommendedCourses,
  recommendedCalculators,
  learningPath,
  suggestedQuestions,
}: Props) {
  const [pendingQuestion, setPendingQuestion] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"chat" | "path" | "courses">("chat");

  const { profile, learningProgress } = memberContext;
  const inProgress = learningProgress.inProgressCourses[0];

  function handleQuestionSelect(q: string) {
    setActiveTab("chat");
    setPendingQuestion(q);
    // Reset so the same question can be sent again
    setTimeout(() => setPendingQuestion(undefined), 100);
  }

  return (
    <div className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ─── Header ──────────────────────────────────────────────────────────── */}
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            AI Financial Tutor
          </p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Welcome back, {profile.displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Your personalized financial education coach. Ask anything, explore
            your learning path, and build real financial competency.
          </p>
        </header>

        {/* ─── Stats bar ───────────────────────────────────────────────────────── */}
        <section
          aria-label="Learning statistics"
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            {
              label: "Competency Score",
              value: learningProgress.financialCompetencyScore,
              color: "text-yellow-400",
            },
            {
              label: "Courses Completed",
              value: learningProgress.completedCourseIds.length,
              color: "text-green-400",
            },
            {
              label: "Learning Hours",
              value: learningProgress.totalHoursLearned,
              color: "text-blue-400",
            },
            {
              label: "Day Streak",
              value: learningProgress.currentStreak,
              color: "text-red-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-slate-800/60 p-4 text-center"
            >
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ─── Continue Learning Banner ─────────────────────────────────────────── */}
        {inProgress && (
          <section
            aria-label="Continue learning"
            className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-slate-800 p-6 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Continue Learning
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                {inProgress.courseTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {inProgress.completedLessons} of {inProgress.totalLessons} lessons ·{" "}
                {inProgress.percentComplete}% complete
              </p>
              {/* Progress bar */}
              <div
                className="mt-3 h-1.5 w-48 max-w-full rounded-full bg-slate-700"
                role="progressbar"
                aria-valuenow={inProgress.percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${inProgress.courseTitle}: ${inProgress.percentComplete}% complete`}
              >
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${inProgress.percentComplete}%` }}
                />
              </div>
            </div>
            <Link
              href={`/courses/${inProgress.courseId}`}
              className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Continue →
            </Link>
          </section>
        )}

        {/* ─── Main layout ─────────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Left: Chat + mobile tabs */}
          <div>
            {/* Mobile tab navigation */}
            <div
              role="tablist"
              aria-label="AI Tutor sections"
              className="mb-4 flex gap-2 lg:hidden"
            >
              {(
                [
                  { id: "chat", label: "AI Chat" },
                  { id: "path", label: "My Path" },
                  { id: "courses", label: "Courses" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    activeTab === tab.id
                      ? "bg-yellow-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chat (always visible on desktop) */}
            <div
              role="tabpanel"
              aria-label="AI Chat"
              className={activeTab === "chat" ? "block" : "hidden lg:block"}
            >
              <AIChatInterface
                initialContext={memberContext}
                externalMessage={pendingQuestion}
              />
            </div>

            {/* Mobile-only: Path tab */}
            {activeTab === "path" && (
              <div
                role="tabpanel"
                aria-label="My learning path"
                className="rounded-2xl bg-slate-900/80 p-6 lg:hidden"
              >
                <LearningPathPanel path={learningPath} />
              </div>
            )}

            {/* Mobile-only: Courses tab */}
            {activeTab === "courses" && (
              <div
                role="tabpanel"
                aria-label="Recommended courses"
                className="space-y-6 lg:hidden"
              >
                <div className="rounded-2xl bg-slate-900/80 p-6">
                  <RecommendedCourses courses={recommendedCourses} />
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-6">
                  <RecommendedCalculators calculators={recommendedCalculators} />
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar (desktop only) */}
          <aside
            aria-label="Learning tools"
            className="hidden space-y-6 lg:block"
          >
            {/* Suggested Questions */}
            <div className="rounded-2xl bg-slate-900/80 p-5">
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={handleQuestionSelect}
              />
            </div>

            {/* Learning Path */}
            <div className="rounded-2xl bg-slate-900/80 p-5">
              <LearningPathPanel path={learningPath} />
            </div>

            {/* Recommended Courses */}
            <div className="rounded-2xl bg-slate-900/80 p-5">
              <RecommendedCourses courses={recommendedCourses} />
            </div>

            {/* Recommended Calculators */}
            <div className="rounded-2xl bg-slate-900/80 p-5">
              <RecommendedCalculators calculators={recommendedCalculators} />
            </div>
          </aside>
        </div>

        {/* ─── Educational disclaimer ───────────────────────────────────────────── */}
        <footer className="mt-12 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-600">
            Edunancial AI Tutor provides general financial education only and
            does not constitute financial, legal, or tax advice. Always consult
            a qualified professional for your specific situation.
          </p>
        </footer>
      </div>
    </div>
  );
}
