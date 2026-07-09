import Link from "next/link";

import PassportPrintButton from "@/components/passport/PassportPrintButton";
import {
  competencyBreakdown,
  learnerProfile,
  passportCertificates,
  publicProfile,
  skillsTranscript,
} from "@/lib/passport/passport-data";

export const metadata = {
  title: "Download Financial Passport PDF | Edunancial",
  description:
    "Printable, PDF-ready version of the Financial Competency Passport.",
};

export default function PassportDownloadPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 print:bg-white">
      <section className="mx-auto max-w-5xl px-6 py-12 print:px-0 print:py-0">
        <div className="print:hidden">
          <div className="flex flex-wrap gap-4">
            <PassportPrintButton className="rounded-xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-slate-800" />
            <Link
              href="/passport"
              className="rounded-xl border border-slate-300 px-6 py-4 font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Back to passport
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Use your browser print dialog and choose “Save as PDF” for a
            downloadable passport file.
          </p>
        </div>

        <article className="mt-8 rounded-[2rem] bg-white p-8 shadow-xl print:mt-0 print:rounded-none print:p-10 print:shadow-none">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-sky-700">
            Edunancial Financial Competency Passport
          </p>
          <div className="mt-6 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black">{learnerProfile.displayName}</h1>
              <p className="mt-3 text-slate-600">{publicProfile.title}</p>
              <p className="mt-2 text-sm text-slate-500">
                Passport ID: {learnerProfile.passportId}
              </p>
            </div>
            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <strong>Overall score:</strong> {learnerProfile.overallScore}
              </p>
              <p>
                <strong>Rank:</strong> {learnerProfile.rank}
              </p>
              <p>
                <strong>Certificates:</strong> {learnerProfile.certificatesEarned}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-black">Competency summary</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {competencyBreakdown.map((entry) => (
                <div key={entry.area} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{entry.area}</h3>
                    <p className="font-bold text-sky-700">{entry.score}%</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{entry.focus}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-black">Verified certificates</h2>
            <div className="mt-5 space-y-4">
              {passportCertificates.map((certificate) => (
                <div key={certificate.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold">{certificate.title}</h3>
                    <p className="text-sm font-semibold text-sky-700">
                      {certificate.credentialId}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Issued {certificate.issuedOn} · Valid through {certificate.validThrough}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-black">Skills transcript</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Competency</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Level</th>
                    <th className="px-3 py-3">CE hours</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsTranscript.map((entry) => (
                    <tr key={entry.category} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-medium">{entry.category}</td>
                      <td className="px-3 py-3">{entry.score}%</td>
                      <td className="px-3 py-3">{entry.proficiency}</td>
                      <td className="px-3 py-3">{entry.continuingEducationHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
