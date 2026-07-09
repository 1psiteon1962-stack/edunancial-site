import Link from "next/link";

import PassportPrintButton from "@/components/passport/PassportPrintButton";
import {
  achievementBadges,
  competencyBreakdown,
  competencyHistory,
  continuingEducation,
  employerVerificationChecks,
  learnerProfile,
  passportCertificates,
  privacyPrinciples,
  progressTimeline,
  publicProfile,
  skillsTranscript,
} from "@/lib/passport/passport-data";

export const metadata = {
  title: "Financial Competency Passport | Edunancial",
  description:
    "Track verified credentials, badges, transcript data, and continuing education in one Financial Competency Passport.",
};

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
              Financial Competency Passport
            </p>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Verified lifelong financial learning, ready to share.
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
              The passport combines digital credentials, achievement badges,
              transcript evidence, continuing education, and employer-ready
              verification into one privacy-first learning record.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/passport/share/${publicProfile.slug}`}
                className="rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500"
              >
                Open shareable profile
              </Link>

              <Link
                href="/passport/verify"
                className="rounded-xl border border-slate-600 px-6 py-4 font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-900"
              >
                Verify credentials
              </Link>

              <PassportPrintButton />
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Digital passport
            </p>

            <h2 className="mt-4 text-3xl font-black">{learnerProfile.displayName}</h2>

            <dl className="mt-8 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt>Passport ID</dt>
                <dd className="font-semibold text-white">
                  {learnerProfile.passportId}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt>Status</dt>
                <dd className="font-semibold text-emerald-300">
                  {learnerProfile.passportStatus}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <dt>Rank</dt>
                <dd className="font-semibold text-white">{learnerProfile.rank}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Member since</dt>
                <dd className="font-semibold text-white">
                  {learnerProfile.memberSince}
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-2xl bg-slate-900 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Overall competency</p>
                  <p className="mt-2 text-5xl font-black text-white">
                    {learnerProfile.overallScore}
                  </p>
                </div>

                <p className="max-w-[10rem] text-right text-sm text-slate-300">
                  {learnerProfile.pointsToNextRank} points from{" "}
                  {learnerProfile.nextRank}
                </p>
              </div>

              <div
                className="mt-4 h-3 rounded-full bg-slate-800"
                aria-hidden="true"
              >
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                  style={{ width: `${learnerProfile.overallScore}%` }}
                />
              </div>
            </div>
          </aside>
        </div>

        <section
          aria-labelledby="passport-stats"
          className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >
          <h2 id="passport-stats" className="sr-only">
            Passport summary statistics
          </h2>
          {[
            ["Courses completed", learnerProfile.completedCourses],
            ["Assessments", learnerProfile.activeAssessments],
            ["Certificates", learnerProfile.certificatesEarned],
            ["Badges", learnerProfile.badgeCount],
            ["Learning hours", learnerProfile.learningHours],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                {label}
              </p>
              <p className="mt-4 text-4xl font-black text-white">{value}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section
            aria-labelledby="competency-breakdown"
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Skills transcript
                </p>
                <h2 id="competency-breakdown" className="mt-3 text-3xl font-black">
                  Competency breakdown
                </h2>
              </div>

              <Link
                href="/passport/download"
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-950"
              >
                View PDF-ready passport
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              {competencyBreakdown.map((entry) => (
                <div key={entry.area}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {entry.area}
                      </h3>
                      <p className="text-sm text-slate-400">{entry.focus}</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-300">
                      {entry.score}%
                    </p>
                  </div>
                  <div
                    className="mt-3 h-3 rounded-full bg-slate-800"
                    aria-hidden="true"
                  >
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400"
                      style={{ width: `${entry.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="privacy-design"
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Privacy by design
            </p>
            <h2 id="privacy-design" className="mt-3 text-3xl font-black">
              Learner control is built in
            </h2>

            <ul className="mt-8 space-y-4 text-slate-300">
              {privacyPrinciples.map((principle) => (
                <li
                  key={principle}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  {principle}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-2">
          <section
            aria-labelledby="achievement-badges"
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Achievement badges
            </p>
            <h2 id="achievement-badges" className="mt-3 text-3xl font-black">
              Verified milestones and skill wins
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {achievementBadges.map((badge) => (
                <article
                  key={badge.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl" aria-hidden="true">
                        {badge.icon}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-white">
                        {badge.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {badge.category}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">{badge.description}</p>
                  <p className="mt-4 text-sm font-medium text-emerald-300">
                    Earned {badge.earnedOn}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="certificate-vault"
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Certificates
                </p>
                <h2 id="certificate-vault" className="mt-3 text-3xl font-black">
                  Credential vault
                </h2>
              </div>

              <Link
                href={`/passport/verify?record=${learnerProfile.passportId}`}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Verify passport
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              {passportCertificates.map((certificate) => (
                <article
                  key={certificate.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {certificate.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {certificate.issuer} · Issued {certificate.issuedOn} ·
                        Valid through {certificate.validThrough}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                      {certificate.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">
                    Credential ID:{" "}
                    <span className="font-semibold text-white">
                      {certificate.credentialId}
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {certificate.skillAreas.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section
            aria-labelledby="transcript-table"
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Skills transcript
            </p>
            <h2 id="transcript-table" className="mt-3 text-3xl font-black">
              Evidence-based competency transcript
            </h2>

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3 text-left">
                <caption className="sr-only">
                  Skill transcript with scores, evidence, and continuing education hours
                </caption>
                <thead>
                  <tr className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    <th className="pb-2 pr-4">Competency</th>
                    <th className="pb-2 pr-4">Score</th>
                    <th className="pb-2 pr-4">Level</th>
                    <th className="pb-2 pr-4">Evidence</th>
                    <th className="pb-2">CE hours</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsTranscript.map((entry) => (
                    <tr key={entry.category} className="align-top">
                      <td className="rounded-l-2xl bg-slate-950/70 p-4 font-semibold text-white">
                        {entry.category}
                      </td>
                      <td className="bg-slate-950/70 p-4 text-emerald-300">
                        {entry.score}%
                      </td>
                      <td className="bg-slate-950/70 p-4 text-slate-200">
                        {entry.proficiency}
                      </td>
                      <td className="bg-slate-950/70 p-4 text-slate-300">
                        {entry.evidence}
                      </td>
                      <td className="rounded-r-2xl bg-slate-950/70 p-4 font-semibold text-white">
                        {entry.continuingEducationHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            aria-labelledby="timeline"
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Progress timeline
            </p>
            <h2 id="timeline" className="mt-3 text-3xl font-black">
              Competency history in motion
            </h2>

            <ol className="mt-8 space-y-4">
              {progressTimeline.map((event) => (
                <li
                  key={`${event.date}-${event.title}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
                      {event.date}
                    </p>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-slate-300">{event.description}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-2">
          <section
            aria-labelledby="continuing-education"
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Continuing education
            </p>
            <h2 id="continuing-education" className="mt-3 text-3xl font-black">
              Renewal and lifelong learning tracking
            </h2>

            <div className="mt-8 space-y-4">
              {continuingEducation.map((record) => {
                const completion = Math.round(
                  (record.completedHours / record.requiredHours) * 100
                );

                return (
                  <article
                    key={record.cycle}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {record.cycle}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                          Focus: {record.focus}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-emerald-300">
                        {record.completedHours}/{record.requiredHours} hrs
                      </p>
                    </div>
                    <div
                      className="mt-4 h-3 rounded-full bg-slate-800"
                      aria-hidden="true"
                    >
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                        style={{ width: `${Math.min(completion, 100)}%` }}
                      />
                    </div>
                    <p className="mt-4 text-sm text-slate-300">
                      Next deadline: {record.nextDeadline}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            aria-labelledby="employer-verification"
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Employer verification
            </p>
            <h2 id="employer-verification" className="mt-3 text-3xl font-black">
              Fast trust checks for reviewers
            </h2>
            <p className="mt-4 text-slate-300">
              Employers, partners, and scholarship teams can confirm passport or
              certificate status using a credential ID without requesting private
              learner data.
            </p>

            <ul className="mt-8 space-y-4">
              {employerVerificationChecks.map((check) => (
                <li
                  key={check}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-200"
                >
                  {check}
                </li>
              ))}
            </ul>

            <Link
              href={`/passport/verify?record=${learnerProfile.passportId}`}
              className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-500"
            >
              Launch verification interface
            </Link>
          </section>
        </div>

        <section
          aria-labelledby="history-table"
          className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Competency history
              </p>
              <h2 id="history-table" className="mt-3 text-3xl font-black">
                Historical growth across every domain
              </h2>
            </div>

            <p className="max-w-xl text-sm text-slate-300">
              The history log preserves progress over time so learners and
              reviewers can see sustained improvement, not just a single score.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full text-left">
              <caption className="sr-only">
                Competency history by quarter and domain
              </caption>
              <thead className="text-sm uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  {[
                    "Period",
                    "Overall",
                    "Personal finance",
                    "Investing",
                    "Real estate",
                    "Business",
                    "Risk",
                  ].map((heading) => (
                    <th key={heading} className="border-b border-slate-800 px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competencyHistory.map((entry) => (
                  <tr key={entry.period} className="text-slate-200">
                    <td className="border-b border-slate-800 px-4 py-4 font-semibold text-white">
                      {entry.period}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.overallScore}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.personalFinance}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.investing}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.realEstate}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.business}
                    </td>
                    <td className="border-b border-slate-800 px-4 py-4">
                      {entry.riskManagement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="shareable-profile"
          className="mt-12 rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Shareable profile
              </p>
              <h2 id="shareable-profile" className="mt-3 text-3xl font-black">
                Public profile with minimum necessary data
              </h2>
              <p className="mt-4 text-slate-300">{publicProfile.privacyNotice}</p>

              <Link
                href={`/passport/share/${publicProfile.slug}`}
                className="mt-8 inline-flex rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Preview public profile
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Public profile snapshot
              </p>
              <h3 className="mt-4 text-2xl font-bold text-white">
                {publicProfile.displayName}
              </h3>
              <p className="mt-2 text-slate-300">{publicProfile.title}</p>
              <p className="mt-4 text-sm text-slate-400">{publicProfile.location}</p>
              <p className="mt-6 text-slate-300">{publicProfile.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {publicProfile.publicAchievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200"
                  >
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
