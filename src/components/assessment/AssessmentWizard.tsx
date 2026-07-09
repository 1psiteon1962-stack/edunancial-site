"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  calculateCompetencyScores,
  competencyLevel,
  type AssessmentAnswer,
  type CompetencyArea,
} from "@/lib/assessment/scoring";

interface Question {
  id: string;
  area: CompetencyArea;
  text: string;
  options: { value: "A" | "B" | "C" | "D"; label: string }[];
}

const SECTIONS: {
  index: number;
  title: string;
  subtitle: string;
  area: CompetencyArea;
  questions: Question[];
}[] = [
  {
    index: 1,
    title: "Personal Financial Management",
    subtitle: "Section 1 of 6",
    area: "personalFinance",
    questions: [
      {
        id: "pf-1",
        area: "personalFinance",
        text: "How often do you prepare and follow a written budget?",
        options: [
          { value: "A", label: "Every month" },
          { value: "B", label: "Most months" },
          { value: "C", label: "Occasionally" },
          { value: "D", label: "Never" },
        ],
      },
      {
        id: "pf-2",
        area: "personalFinance",
        text: "If you lost your primary income today, how long could you cover normal expenses?",
        options: [
          { value: "A", label: "More than one year" },
          { value: "B", label: "Six to twelve months" },
          { value: "C", label: "One to six months" },
          { value: "D", label: "Less than one month" },
        ],
      },
      {
        id: "pf-3",
        area: "personalFinance",
        text: "Which statement best describes your savings habits?",
        options: [
          { value: "A", label: "I save automatically every payday." },
          { value: "B", label: "I save regularly but not consistently." },
          { value: "C", label: "I save only when money is left over." },
          { value: "D", label: "I rarely save money." },
        ],
      },
      {
        id: "pf-4",
        area: "personalFinance",
        text: "When making a purchase, what usually influences your decision most?",
        options: [
          { value: "A", label: "My written financial plan and budget." },
          { value: "B", label: "I compare value before buying." },
          { value: "C", label: "I usually decide based on emotion." },
          { value: "D", label: "I buy what I want without much planning." },
        ],
      },
    ],
  },
  {
    index: 2,
    title: "Investing & Paper Assets",
    subtitle: "Section 2 of 6",
    area: "investing",
    questions: [
      {
        id: "inv-1",
        area: "investing",
        text: "How would you describe your current investment portfolio?",
        options: [
          { value: "A", label: "Diversified across multiple asset classes." },
          { value: "B", label: "Mostly in stocks and mutual funds." },
          { value: "C", label: "Primarily in savings accounts." },
          { value: "D", label: "I don't currently invest." },
        ],
      },
      {
        id: "inv-2",
        area: "investing",
        text: "How well do you understand the difference between stocks, ETFs, and bonds?",
        options: [
          { value: "A", label: "Very well — I actively manage my portfolio." },
          { value: "B", label: "Moderately — I understand the basics." },
          { value: "C", label: "Slightly — I've read about them but don't invest." },
          { value: "D", label: "Not at all." },
        ],
      },
      {
        id: "inv-3",
        area: "investing",
        text: "How much do you contribute to a retirement account annually?",
        options: [
          { value: "A", label: "Maximum allowed contribution." },
          { value: "B", label: "A consistent, meaningful amount." },
          { value: "C", label: "Occasionally or minimally." },
          { value: "D", label: "Nothing currently." },
        ],
      },
      {
        id: "inv-4",
        area: "investing",
        text: "How do you manage investment risk?",
        options: [
          { value: "A", label: "I use a documented risk management strategy." },
          { value: "B", label: "I diversify and rebalance periodically." },
          { value: "C", label: "I mostly avoid risk by staying in cash." },
          { value: "D", label: "I haven't thought much about risk management." },
        ],
      },
    ],
  },
  {
    index: 3,
    title: "Real Estate",
    subtitle: "Section 3 of 6",
    area: "realEstate",
    questions: [
      {
        id: "re-1",
        area: "realEstate",
        text: "Do you currently own investment real estate?",
        options: [
          { value: "A", label: "Yes — multiple properties generating cash flow." },
          { value: "B", label: "Yes — one investment property." },
          { value: "C", label: "No, but I'm actively researching." },
          { value: "D", label: "No, and I haven't considered it." },
        ],
      },
      {
        id: "re-2",
        area: "realEstate",
        text: "How well do you understand real estate cash flow analysis?",
        options: [
          { value: "A", label: "Very well — I calculate cap rates and NOI." },
          { value: "B", label: "Moderately — I understand cash flow basics." },
          { value: "C", label: "Slightly — I've heard of these concepts." },
          { value: "D", label: "Not at all." },
        ],
      },
      {
        id: "re-3",
        area: "realEstate",
        text: "How familiar are you with creative real estate financing?",
        options: [
          { value: "A", label: "Very — I've used subject-to, owner finance, etc." },
          { value: "B", label: "Familiar with concepts but haven't used them." },
          { value: "C", label: "I've heard of them but don't understand them well." },
          { value: "D", label: "Not familiar at all." },
        ],
      },
      {
        id: "re-4",
        area: "realEstate",
        text: "What is your approach to building real estate wealth?",
        options: [
          { value: "A", label: "Active acquisition with a documented strategy." },
          { value: "B", label: "Learning and preparing to acquire." },
          { value: "C", label: "Passively interested but no concrete plan." },
          { value: "D", label: "Real estate is not part of my financial plan." },
        ],
      },
    ],
  },
  {
    index: 4,
    title: "Business",
    subtitle: "Section 4 of 6",
    area: "business",
    questions: [
      {
        id: "biz-1",
        area: "business",
        text: "Do you own or operate a business?",
        options: [
          { value: "A", label: "Yes — profitable and growing." },
          { value: "B", label: "Yes — in early stages or break-even." },
          { value: "C", label: "No, but actively planning to start one." },
          { value: "D", label: "No business ownership." },
        ],
      },
      {
        id: "biz-2",
        area: "business",
        text: "How well do you track your business KPIs?",
        options: [
          { value: "A", label: "Weekly dashboard with key performance metrics." },
          { value: "B", label: "Monthly review of major financial metrics." },
          { value: "C", label: "Occasional review when problems arise." },
          { value: "D", label: "I don't track KPIs." },
        ],
      },
      {
        id: "biz-3",
        area: "business",
        text: "How well do you understand your business profit margins?",
        options: [
          { value: "A", label: "Precisely — I optimize margins consistently." },
          { value: "B", label: "Moderately — I review them regularly." },
          { value: "C", label: "Slightly — I know if I'm profitable or not." },
          { value: "D", label: "I'm not sure of my margins." },
        ],
      },
      {
        id: "biz-4",
        area: "business",
        text: "What is your current approach to business growth?",
        options: [
          { value: "A", label: "Documented scaling plan with systems and delegation." },
          { value: "B", label: "Growing but without a formal plan." },
          { value: "C", label: "Focused on survival rather than growth." },
          { value: "D", label: "No business to grow currently." },
        ],
      },
    ],
  },
  {
    index: 5,
    title: "Risk Management",
    subtitle: "Section 5 of 6",
    area: "riskManagement",
    questions: [
      {
        id: "rm-1",
        area: "riskManagement",
        text: "How well protected is your income from disability or illness?",
        options: [
          { value: "A", label: "Fully insured with disability and income protection." },
          { value: "B", label: "Partially covered through employer benefits." },
          { value: "C", label: "Minimal coverage." },
          { value: "D", label: "No income protection insurance." },
        ],
      },
      {
        id: "rm-2",
        area: "riskManagement",
        text: "How are your personal assets protected legally?",
        options: [
          { value: "A", label: "LLCs, trusts, and legal structures in place." },
          { value: "B", label: "Some legal protection in place." },
          { value: "C", label: "I'm planning to set up protection." },
          { value: "D", label: "No legal asset protection in place." },
        ],
      },
      {
        id: "rm-3",
        area: "riskManagement",
        text: "How prepared are you financially for a major economic downturn?",
        options: [
          { value: "A", label: "Very prepared — diversified and liquid reserves." },
          { value: "B", label: "Somewhat prepared with some reserves." },
          { value: "C", label: "Minimally prepared." },
          { value: "D", label: "Not prepared at all." },
        ],
      },
      {
        id: "rm-4",
        area: "riskManagement",
        text: "Do you have an estate plan (will, beneficiaries, POA)?",
        options: [
          { value: "A", label: "Complete and recently updated estate plan." },
          { value: "B", label: "Basic documents in place but not comprehensive." },
          { value: "C", label: "Started but not completed." },
          { value: "D", label: "No estate plan." },
        ],
      },
    ],
  },
  {
    index: 6,
    title: "Financial Profile",
    subtitle: "Section 6 of 6",
    area: "financialProfile",
    questions: [
      {
        id: "fp-1",
        area: "financialProfile",
        text: "How clearly defined are your long-term financial goals?",
        options: [
          { value: "A", label: "Written, specific goals with timelines and plans." },
          { value: "B", label: "General goals I think about regularly." },
          { value: "C", label: "Vague ideas about what I want financially." },
          { value: "D", label: "I haven't set financial goals." },
        ],
      },
      {
        id: "fp-2",
        area: "financialProfile",
        text: "How would you describe your financial education?",
        options: [
          { value: "A", label: "Extensive — I continuously study money and investing." },
          { value: "B", label: "Good — I've studied several key areas." },
          { value: "C", label: "Basic — some general financial literacy." },
          { value: "D", label: "Minimal formal financial education." },
        ],
      },
      {
        id: "fp-3",
        area: "financialProfile",
        text: "How consistent are your financial habits overall?",
        options: [
          { value: "A", label: "Highly disciplined and consistent financial habits." },
          { value: "B", label: "Mostly consistent with occasional lapses." },
          { value: "C", label: "Inconsistent — I struggle to maintain good habits." },
          { value: "D", label: "Poor financial habits I want to change." },
        ],
      },
      {
        id: "fp-4",
        area: "financialProfile",
        text: "What best describes your financial mentorship or community?",
        options: [
          { value: "A", label: "Active financial mentor and peer learning group." },
          { value: "B", label: "Some guidance from books, courses, or advisors." },
          { value: "C", label: "Mostly self-directed without much guidance." },
          { value: "D", label: "Learning entirely on my own without guidance." },
        ],
      },
    ],
  },
];

const RESULTS_KEY = "edu_assessment_results";

export default function AssessmentWizard() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [submitting, setSubmitting] = useState(false);

  const section = SECTIONS[currentSection];
  const totalQuestions = SECTIONS.flatMap((s) => s.questions).length;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const sectionAnswered = section.questions.every((q) => answers[q.id]);

  function answer(questionId: string, value: "A" | "B" | "C" | "D") {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleFinish() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const answerArray: AssessmentAnswer[] = Object.entries(answers).map(
      ([questionId, ans]) => {
        const q = SECTIONS.flatMap((s) => s.questions).find((q) => q.id === questionId)!;
        return { area: q.area, questionId, answer: ans };
      }
    );

    const scores = calculateCompetencyScores(answerArray);
    const level = competencyLevel(scores.overall);

    // Store results for the results page
    try {
      localStorage.setItem(
        RESULTS_KEY,
        JSON.stringify({ scores, level, completedAt: new Date().toISOString() })
      );
    } catch {
      // ignore
    }

    // Update user profile
    if (user) {
      updateProfile({
        assessmentCompleted: true,
        overallScore: scores.overall,
      });
    }

    router.push("/assessment/results");
  }

  function next() {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinish();
    }
  }

  function prev() {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-16">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              Section {section.index} of {SECTIONS.length}
            </span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Section steps */}
          <div className="mt-4 flex gap-2">
            {SECTIONS.map((s, i) => (
              <button
                key={s.index}
                onClick={() => setCurrentSection(i)}
                className={`flex-1 h-1.5 rounded-full transition ${
                  i < currentSection
                    ? "bg-green-500"
                    : i === currentSection
                    ? "bg-blue-500"
                    : "bg-slate-700"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Section header */}
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          {section.subtitle}
        </p>
        <h1 className="mt-4 text-5xl font-black">{section.title}</h1>

        {/* Questions */}
        <div className="mt-10 space-y-8">
          {section.questions.map((q, qi) => (
            <div key={q.id} className="rounded-2xl bg-slate-900 p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Question {qi + 1}
              </p>
              <p className="text-xl font-semibold leading-8">{q.text}</p>
              <div className="mt-6 space-y-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => answer(q.id, opt.value)}
                      className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${
                        selected
                          ? "border-blue-500 bg-blue-900/40 text-white"
                          : "border-slate-700 text-slate-300 hover:border-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`mr-3 font-bold ${selected ? "text-blue-400" : "text-slate-500"}`}>
                        {opt.value}.
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={currentSection === 0}
            className="rounded-xl border border-slate-600 px-8 py-3 font-bold hover:border-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {currentSection < SECTIONS.length - 1 ? (
            <button
              onClick={next}
              disabled={!sectionAnswered}
              className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Section {section.index + 1} →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!sectionAnswered || submitting}
              className="rounded-xl bg-green-600 px-8 py-3 font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Calculating results…" : "Complete Assessment →"}
            </button>
          )}
        </div>

        {!sectionAnswered && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Please answer all questions in this section to continue.
          </p>
        )}
      </section>
    </main>
  );
}
