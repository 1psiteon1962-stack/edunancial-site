import Link from "next/link";

import {
  employerVerificationChecks,
  getVerificationRecord,
  learnerProfile,
  verificationRecords,
} from "@/lib/passport/passport-data";

interface PassportVerifyPageProps {
  searchParams: Promise<{
    record?: string;
  }>;
}

export const metadata = {
  title: "Verify Financial Passport Credentials | Edunancial",
  description:
    "Confirm a Financial Competency Passport or certificate using a credential ID.",
};

export default async function PassportVerifyPage({
  searchParams,
}: PassportVerifyPageProps) {
  const params = await searchParams;
  const record = getVerificationRecord(params.record);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="font-bold uppercase tracking-[0.4em] text-emerald-300">
          Employer verification interface
        </p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          Credential verification
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Enter a passport or certificate ID to confirm current status, issue
          date, and evidence summary without exposing private learner data.
        </p>

        <form
          action="/passport/verify"
          method="get"
          className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
        >
          <label htmlFor="record" className="block text-sm font-semibold text-white">
            Credential or passport ID
          </label>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <input
              id="record"
              name="record"
              type="text"
              defaultValue={params.record ?? ""}
              placeholder={learnerProfile.passportId}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-4 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-500"
            >
              Verify now
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Try {learnerProfile.passportId} or {verificationRecords[1]?.recordId}.
          </p>
        </form>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Verification result</h2>
            {params.record ? (
              record ? (
                <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                    {record.status}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    {record.title}
                  </h3>
                  <dl className="mt-6 space-y-3 text-slate-200">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <dt>Learner</dt>
                      <dd className="font-semibold">{record.learnerName}</dd>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <dt>Record ID</dt>
                      <dd className="font-semibold">{record.recordId}</dd>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <dt>Issued on</dt>
                      <dd className="font-semibold">{record.issuedOn}</dd>
                    </div>
                  </dl>
                  <p className="mt-6 text-slate-200">{record.evidence}</p>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-rose-300">
                    No active match
                  </p>
                  <p className="mt-3 text-slate-200">
                    We could not find an active record for {params.record}. Confirm
                    the ID with the learner before making a decision.
                  </p>
                </div>
              )
            ) : (
              <p className="mt-6 text-slate-300">
                Submit a passport or certificate ID to display verification details.
              </p>
            )}
          </section>

          <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
            <h2 className="text-2xl font-black">What this confirms</h2>
            <ul className="mt-6 space-y-4">
              {employerVerificationChecks.map((check) => (
                <li
                  key={check}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-slate-200"
                >
                  {check}
                </li>
              ))}
            </ul>

            <Link
              href="/passport"
              className="mt-8 inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Back to passport
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
