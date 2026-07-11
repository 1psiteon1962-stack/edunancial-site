import Link from "next/link";

import { currentUser } from "@/lib/auth";
import {
  getAdaptiveLearningExperience,
  NORTH_AMERICA_TRACKS,
  TRACK_COLOR_STYLES,
  TRACK_SURFACE_STYLES,
  TRACK_TEXT_STYLES,
} from "@/lib/adaptive-learning";

const savedResources = [
  { title: "Saved Resources", detail: "Bookmarks, downloads, and notes", href: "/favorites" },
  { title: "Download Center", detail: "Worksheets, templates, and guides", href: "/downloads" },
  { title: "Certificates", detail: "Review completed milestones", href: "/my-certificates" },
];

const upcomingEvents = [
  { title: "Live webinar: Build a family wealth plan", date: "Tue • 7:00 PM", href: "/webinars" },
  { title: "Member Q&A with the AI Coach", date: "Thu • 1:00 PM", href: "/events" },
  { title: "Business KPI office hours", date: "Sat • 11:00 AM", href: "/webinars" },
];

const announcements = [
  "Adaptive learning now maps assessment competency to track-by-track progression for North America.",
  "Curriculum IDs are recognized automatically once new lessons are imported into the registry.",
  "Lesson unlocks stay gated by configurable mastery thresholds before learners advance.",
];

export const metadata = {
  title: "Member Dashboard | Edunancial",
  description:
    "Track progress, resume learning, access tools, and stay connected with upcoming member resources.",
};

export default function DashboardPage() {
  const user = currentUser();
  const firstName = user?.firstName ?? "Member";
  const adaptiveLearning = getAdaptiveLearningExperience(user?.id ?? "guest-member");
  const recommendedTrack = adaptiveLearning.recommendedTrack;
  const selectedTrack = adaptiveLearning.studentProgress.tracks[recommendedTrack];
  const continueLearningHref = selectedTrack.nextLesson ? "/continue-learning" : "/courses";
  const learningProgress = Object.entries(adaptiveLearning.studentProgress.tracks).map(
    ([track, progress]) => ({
      track,
      label: NORTH_AMERICA_TRACKS[track as keyof typeof NORTH_AMERICA_TRACKS],
      level: progress.currentLevel,
      value: progress.completionPercentage,
      status: progress.assessmentStatus,
      nextLesson: progress.nextLesson?.id ?? "Awaiting curriculum upload",
    }),
  );
  const recentlyViewed = learningProgress.map((item) => ({
    title: `${item.track} ${item.level}`,
    detail: `${item.label} • ${item.nextLesson}`,
    href: "/continue-learning",
  }));
  const financialTools = [
    { title: "Financial Tools", detail: "Calculators and decision aids", href: "/financial-tools" },
    { title: "Assessment", detail: "Refresh your competency baseline", href: "/assessment" },
    { title: "Continue Learning", detail: "Open the adaptive learning queue", href: continueLearningHref },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-[#132347] p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">
              {firstName}, your member dashboard is ready.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Your adaptive learning framework now connects assessment mastery to independent RED,
              WHITE, and BLUE progression so every next lesson can unlock from the right competency path.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={continueLearningHref}
                className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                Continue Learning
              </Link>
              <Link
                href="/assessment/results"
                className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                View Assessment Results
              </Link>
              <Link
                href="/my-courses"
                className="rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
              >
                My Courses
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {adaptiveLearning.dashboardWidgets.map((widget) => (
              <div key={widget.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{widget.label}</p>
                <p className="mt-4 text-2xl font-black">{widget.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Learning Progress</h2>
              <Link href="/course-progress" className="font-bold text-blue-300 hover:text-blue-200">
                Full progress &rarr;
              </Link>
            </div>
            <div className="mt-8 space-y-6">
              {learningProgress.map((item) => (
                <div key={item.track}>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-300">
                    <span>
                      {item.track} • {item.label} • {item.level}
                    </span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-700">
                    <div
                      className={`h-3 rounded-full ${TRACK_COLOR_STYLES[item.track as keyof typeof TRACK_COLOR_STYLES]}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>{item.status}</span>
                    <span>Next: {item.nextLesson}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl border p-8 ${TRACK_SURFACE_STYLES[recommendedTrack]} ${recommendedTrack === "WHITE" ? "text-slate-950" : "text-white"}`}
          >
            <p className={`text-sm font-bold uppercase tracking-[0.35em] ${TRACK_TEXT_STYLES[recommendedTrack]}`}>
              Recommended Next Lesson
            </p>
            <h2 className="mt-4 text-3xl font-black">
              {selectedTrack.nextLesson?.title ?? `${recommendedTrack} curriculum is ready for future uploads`}
            </h2>
            <p className={`mt-5 text-base leading-8 ${recommendedTrack === "WHITE" ? "text-slate-700" : "text-slate-200"}`}>
              Current focus: {recommendedTrack} {selectedTrack.currentLevel}. {selectedTrack.assessmentStatus}.
              Lessons unlock only after mastery reaches the configured minimum of {adaptiveLearning.masteryThreshold}%.
            </p>
            <div className={`mt-6 rounded-2xl border p-4 ${recommendedTrack === "WHITE" ? "border-slate-300 bg-white/70" : "border-white/10 bg-slate-950/30"}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Curriculum Recognition</p>
              <p className="mt-2 text-sm">
                Framework recognizes IDs like RED-L1-001, WHITE-L3-008, and BLUE-L5-010 automatically.
              </p>
            </div>
            <Link
              href={continueLearningHref}
              className={`mt-8 inline-flex rounded-xl px-6 py-4 font-black transition ${recommendedTrack === "WHITE" ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-white text-slate-950 hover:bg-slate-100"}`}
            >
              Continue Learning
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Track Queue</h2>
              <Link href="/continue-learning" className="font-bold text-blue-300 hover:text-blue-200">
                View all &rarr;
              </Link>
            </div>
            <div className="mt-8 space-y-4">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
              Adaptive Learning Framework
            </p>
            <h2 className="mt-4 text-3xl font-black">Assessment results now drive curriculum progression</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Student progress records now track current level, current lesson, lessons completed,
              assessment scores, completion timing, completion percentage, certificates earned, and last login.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Object.entries(adaptiveLearning.studentProgress.tracks).map(([track, progress]) => (
                <div key={track} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-bold">{track}</p>
                  <p className="mt-2">{progress.currentLevel}</p>
                  <p className="mt-2 text-slate-400">{progress.assessmentStatus}</p>
                </div>
              ))}
            </div>
            <Link
              href="/assessment"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              Launch Assessment
            </Link>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Financial Tools</h2>
            <div className="mt-6 space-y-4">
              {financialTools.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Saved Resources</h2>
            <div className="mt-6 space-y-4">
              {savedResources.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Upcoming Webinars &amp; Events</h2>
            <div className="mt-6 space-y-4">
              {upcomingEvents.map((item) => (
                <Link
                  key={`${item.title}-${item.date}`}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">{item.date}</p>
                  <h3 className="mt-2 font-bold">{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Announcements</p>
              <h2 className="mt-3 text-3xl font-black">What&rsquo;s new for members</h2>
            </div>
            <Link href="/notifications" className="font-bold text-blue-300 hover:text-blue-200">
              All announcements &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {announcements.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
