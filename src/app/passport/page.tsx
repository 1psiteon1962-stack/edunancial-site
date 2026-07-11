import Link from "next/link";
import { getDemoPassport } from "@/lib/competency/demo-data";
import CompetencyLevelBadge from "@/components/passport/CompetencyLevelBadge";
import ProgressDashboard from "@/components/passport/ProgressDashboard";
import CertificateGallery from "@/components/passport/CertificateGallery";
import AchievementList from "@/components/passport/AchievementList";
import PassportTimeline from "@/components/passport/PassportTimeline";
import AICoachAccessGate from "@/components/passport/AICoachAccessGate";

export const metadata = {
  title: "Financial Competency Passport | Edunancial",
  description:
    "Your lifelong Financial Competency Passport — track progress, earn certificates, and unlock AI coaching.",
};

export default function PassportPage() {
  const passport = getDemoPassport();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          MEMBER COMPETENCY PASSPORT
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <h1 className="text-5xl font-black md:text-7xl">
            {passport.memberName}&apos;s<br />Competency Passport
          </h1>
          <CompetencyLevelBadge
            level={passport.currentLevel}
            score={passport.overallScore}
            size="lg"
          />
        </div>

        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Unlike a traditional report card, your Financial Competency Passport
          grows with you throughout your lifetime. Every assessment, course, and
          certificate becomes part of your permanent record.
        </p>

        {/* Stats Row */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl bg-blue-700 p-8 text-center">
            <p className="text-sm uppercase tracking-widest">Overall Score</p>
            <h2 className="mt-4 text-6xl font-black">{passport.overallScore}</h2>
          </div>
          <div className="rounded-2xl bg-slate-800 p-8 text-center">
            <p className="text-sm uppercase tracking-widest">Courses</p>
            <h2 className="mt-4 text-6xl font-black">{passport.completedCourses}</h2>
            <p className="text-sm text-slate-400">of {passport.totalCourses}</p>
          </div>
          <div className="rounded-2xl bg-green-700 p-8 text-center">
            <p className="text-sm uppercase tracking-widest">Certificates</p>
            <h2 className="mt-4 text-6xl font-black">
              {passport.certificates.filter((c) => c.downloadUrl !== "").length}
            </h2>
          </div>
          <div className="rounded-2xl bg-yellow-600 p-8 text-center">
            <p className="text-sm uppercase tracking-widest">Achievements</p>
            <h2 className="mt-4 text-6xl font-black">
              {passport.achievements.filter((a) => a.earned).length}
            </h2>
          </div>
        </div>

        {/* Level Progress */}
        {passport.nextLevel && (
          <div className="mt-10 rounded-2xl border border-blue-700/40 bg-blue-950/20 p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Next Level
            </p>
            <p className="mt-2 text-xl">
              <strong>{passport.pointsToNextLevel} points</strong> to reach{" "}
              <strong>{passport.nextLevel}</strong>
            </p>
            <div className="mt-4 h-3 w-full rounded-full bg-slate-700">
              <div
                className="h-3 rounded-full bg-blue-500 transition-all"
                style={{ width: `${passport.overallScore}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Coach Gate */}
        <div className="mt-10">
          <AICoachAccessGate access={passport.aiCoachAccess} />
        </div>

        {/* Progress Dashboard */}
        <div className="mt-10">
          <ProgressDashboard
            overallScore={passport.overallScore}
            areaScores={passport.areaScores}
            completedCourses={passport.completedCourses}
            totalCourses={passport.totalCourses}
            completionPercentage={passport.completionPercentage}
          />
        </div>

        {/* Certificates */}
        <div className="mt-10">
          <CertificateGallery certificates={passport.certificates} />
        </div>

        {/* Achievements */}
        <div className="mt-10">
          <AchievementList achievements={passport.achievements} showAll />
        </div>

        {/* History */}
        <div className="mt-10">
          <PassportTimeline history={passport.history} />
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-yellow-500 bg-[#111827] p-10">
          <h2 className="text-3xl font-black">Your Financial Journey Never Ends</h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Every assessment, completed course, and earned certificate is recorded
            permanently in your Competency Passport — shared across all Edunancial
            global regions.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            View Dashboard
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Continue Learning
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >
            Retake Assessment
          </Link>
          <Link
            href="/my-certificates"
            className="rounded-xl border border-yellow-500 px-10 py-5 text-xl font-bold hover:bg-yellow-500 hover:text-slate-950"
          >
            My Certificates
          </Link>
        </div>

      </section>

    </main>
  );
}

