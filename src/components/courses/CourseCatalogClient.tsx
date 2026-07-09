"use client";

import { useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  category: string;
  track: "RED" | "WHITE" | "BLUE" | "FOUNDATION" | "FAMILY" | "EXECUTIVE";
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  hours: number;
  description: string;
}

const COURSES: Course[] = [
  // RED - Real Estate
  { id: "re-fundamentals", title: "Real Estate Fundamentals", category: "Real Estate", track: "RED", level: "Beginner", lessons: 12, hours: 8, description: "Build a solid foundation in residential real estate investing principles." },
  { id: "re-commercial", title: "Commercial Real Estate", category: "Real Estate", track: "RED", level: "Intermediate", lessons: 15, hours: 11, description: "Learn commercial property analysis, cap rates, and deal structuring." },
  { id: "re-creative", title: "Creative Financing Strategies", category: "Real Estate", track: "RED", level: "Advanced", lessons: 10, hours: 7, description: "Subject-to, owner financing, lease options, and creative deal structures." },
  { id: "re-tax-liens", title: "Tax Liens & Tax Deeds", category: "Real Estate", track: "RED", level: "Intermediate", lessons: 8, hours: 6, description: "Invest in tax-delinquent properties and acquire equity below market value." },
  { id: "re-1031", title: "1031 Exchanges & Tax Strategy", category: "Real Estate", track: "RED", level: "Advanced", lessons: 6, hours: 5, description: "Defer capital gains and build a larger portfolio through 1031 exchanges." },
  { id: "re-wealth", title: "Building Wealth Through Real Estate", category: "Real Estate", track: "RED", level: "Intermediate", lessons: 18, hours: 13, description: "Comprehensive real estate wealth-building from acquisition to cash flow." },

  // WHITE - Investing
  { id: "inv-personal", title: "Personal Financial Management", category: "Financial Assets", track: "WHITE", level: "Beginner", lessons: 10, hours: 7, description: "Budgeting, cash flow, emergency funds, and financial decision making." },
  { id: "inv-stocks", title: "Stocks & ETF Investing", category: "Financial Assets", track: "WHITE", level: "Beginner", lessons: 12, hours: 8, description: "Build a portfolio with stocks, ETFs, and index funds for long-term wealth." },
  { id: "inv-options", title: "Options Trading Fundamentals", category: "Financial Assets", track: "WHITE", level: "Intermediate", lessons: 14, hours: 10, description: "Calls, puts, covered calls, and options strategies for income generation." },
  { id: "inv-retirement", title: "Retirement Planning Mastery", category: "Financial Assets", track: "WHITE", level: "Intermediate", lessons: 9, hours: 7, description: "IRA, 401(k), Roth strategies, and Social Security optimization." },
  { id: "inv-precious", title: "Precious Metals & Alternative Assets", category: "Financial Assets", track: "WHITE", level: "Advanced", lessons: 7, hours: 5, description: "Gold, silver, commodities, and alternative investment allocation strategies." },
  { id: "inv-credit", title: "Credit Mastery & Debt Elimination", category: "Financial Assets", track: "WHITE", level: "Beginner", lessons: 8, hours: 6, description: "Repair, build, and leverage your credit score for financial advantage." },

  // BLUE - Business
  { id: "biz-startup", title: "Startup Fundamentals", category: "Business", track: "BLUE", level: "Beginner", lessons: 11, hours: 8, description: "Business model, validation, market fit, and starting your first business." },
  { id: "biz-kpi", title: "Executive KPI Dashboard", category: "Business", track: "BLUE", level: "Advanced", lessons: 12, hours: 9, description: "Measure, track, and optimize business performance with key KPIs." },
  { id: "biz-marketing", title: "Digital Marketing for Entrepreneurs", category: "Business", track: "BLUE", level: "Intermediate", lessons: 13, hours: 10, description: "SEO, social media, email funnels, and digital marketing ROI." },
  { id: "biz-profit", title: "Profitability & Pricing Strategy", category: "Business", track: "BLUE", level: "Intermediate", lessons: 9, hours: 7, description: "Optimize pricing, reduce costs, and maximize business profitability." },
  { id: "biz-scaling", title: "Scaling Your Business", category: "Business", track: "BLUE", level: "Advanced", lessons: 11, hours: 8, description: "Systems, hiring, automation, and growth strategies for scaling." },
  { id: "biz-leadership", title: "Leadership & Executive Presence", category: "Business", track: "BLUE", level: "Advanced", lessons: 8, hours: 6, description: "Develop leadership skills, team management, and executive communication." },

  // Foundation
  { id: "econ-defense", title: "Economic Self-Defense", category: "Financial Foundations", track: "FOUNDATION", level: "Beginner", lessons: 8, hours: 6, description: "Protect your wealth from inflation, recession, and economic downturns." },
  { id: "risk-mgmt", title: "Advanced Risk Management", category: "Financial Foundations", track: "FOUNDATION", level: "Intermediate", lessons: 10, hours: 8, description: "Asset protection, insurance, diversification, and wealth preservation." },

  // Family
  { id: "family-finance", title: "Family Financial Planning", category: "Family", track: "FAMILY", level: "Beginner", lessons: 9, hours: 7, description: "Build a family financial plan covering education, insurance, and estate." },
  { id: "teen-entrepreneur", title: "Teen Entrepreneur Bootcamp", category: "Family", track: "FAMILY", level: "Beginner", lessons: 10, hours: 8, description: "Financial literacy and entrepreneurship fundamentals for teenagers." },

  // Executive
  { id: "exec-summary", title: "Executive Business Summary", category: "Executive", track: "EXECUTIVE", level: "Advanced", lessons: 7, hours: 5, description: "Present compelling business summaries for investors and boards." },
  { id: "exec-strategy", title: "Strategic Business Planning", category: "Executive", track: "EXECUTIVE", level: "Advanced", lessons: 12, hours: 9, description: "Long-range planning, competitive analysis, and strategic execution." },
];

const TRACKS = [
  { id: "ALL", label: "All Courses", color: "bg-slate-700 text-white" },
  { id: "RED", label: "RED – Real Estate", color: "bg-red-700 text-white" },
  { id: "WHITE", label: "WHITE – Investing", color: "bg-white text-slate-900" },
  { id: "BLUE", label: "BLUE – Business", color: "bg-blue-700 text-white" },
  { id: "FOUNDATION", label: "Foundations", color: "bg-green-700 text-white" },
  { id: "FAMILY", label: "Family", color: "bg-purple-700 text-white" },
  { id: "EXECUTIVE", label: "Executive", color: "bg-yellow-600 text-white" },
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const TRACK_BORDERS: Record<string, string> = {
  RED: "border-l-4 border-red-600",
  WHITE: "border-l-4 border-slate-300",
  BLUE: "border-l-4 border-blue-600",
  FOUNDATION: "border-l-4 border-green-600",
  FAMILY: "border-l-4 border-purple-600",
  EXECUTIVE: "border-l-4 border-yellow-500",
};

export default function CourseCatalogClient() {
  const [track, setTrack] = useState("ALL");
  const [level, setLevel] = useState("All Levels");
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter((c) => {
    if (track !== "ALL" && c.track !== track) return false;
    if (level !== "All Levels" && c.level !== level) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          Course Catalog
        </p>
        <h1 className="mt-6 text-5xl font-black">
          Build Financial Competency
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          {COURSES.length} courses across Real Estate, Investing, Business, and more.
          Filter by track and level to find your next learning path.
        </p>

        {/* Search */}
        <div className="mt-10">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Track filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                track === t.id ? t.color + " ring-2 ring-white/60" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Level filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                level === l ? "bg-white text-slate-900" : "border border-slate-600 text-slate-400 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mt-6 text-sm text-slate-400">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-slate-900 p-12 text-center text-slate-400">
            No courses match your filters. Try adjusting your search.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <div
                key={course.id}
                className={`rounded-2xl bg-slate-900 p-6 ${TRACK_BORDERS[course.track] ?? ""} hover:bg-slate-800 transition`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      course.track === "RED" ? "bg-red-700" :
                      course.track === "WHITE" ? "bg-white text-slate-900" :
                      course.track === "BLUE" ? "bg-blue-700" :
                      course.track === "FOUNDATION" ? "bg-green-700" :
                      course.track === "FAMILY" ? "bg-purple-700" :
                      "bg-yellow-600"
                    }`}
                  >
                    {course.track}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{course.level}</span>
                </div>
                <h3 className="mt-4 text-xl font-black">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-6">{course.description}</p>
                <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
                  <span>📚 {course.lessons} lessons</span>
                  <span>⏱ {course.hours} hours</span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="mt-5 inline-block w-full rounded-xl border border-slate-600 px-4 py-2 text-center text-sm font-bold hover:border-white hover:bg-white hover:text-slate-900 transition"
                >
                  View Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
