import type { Metadata } from "next";
import CertificateTemplate from "@/components/gamification/CertificateTemplate";
import type { UserCertificate } from "@/lib/gamification/types";

export const metadata: Metadata = {
  title: "My Certificates | Edunancial",
  description:
    "View and download your Edunancial certificates of achievement.",
};

// Demo data — replace with real user certificates from your auth/data layer
const demoCertificates: UserCertificate[] = [
  {
    id: "demo_1",
    userId: "demo",
    templateId: "cert_financial_foundations",
    studentName: "Alex Johnson",
    credentialTitle: "Financial Foundations",
    issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    certificateNumber: "EDU-2025-004821",
    verificationUrl: "/verify/EDU-2025-004821",
  },
];

export default function MyCertificatesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          MY CERTIFICATES
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Your Credentials
        </h1>

        <p className="mt-6 text-lg text-slate-400">
          Certificates you&apos;ve earned through Edunancial courses and programs.
        </p>

        {demoCertificates.length > 0 ? (
          <div className="mt-14 space-y-10">
            {demoCertificates.map((cert) => (
              <CertificateTemplate key={cert.id} certificate={cert} detailed />
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl bg-slate-900 p-10 text-center">
            <p className="text-5xl" role="img" aria-label="Certificate">🎓</p>
            <h2 className="mt-6 text-2xl font-black">No Certificates Yet</h2>
            <p className="mt-4 text-slate-400">
              Complete a course to earn your first certificate.
            </p>
            <a
              href="/courses"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
