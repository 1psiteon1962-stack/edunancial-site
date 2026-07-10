import type { Metadata } from "next";
import CertificateTemplate from "@/components/gamification/CertificateTemplate";
import { CERTIFICATE_TEMPLATES } from "@/lib/gamification/certificateEngine";
import type { CertificateType } from "@/lib/gamification/types";

export const metadata: Metadata = {
  title: "Certificates | Edunancial",
  description:
    "Earn and showcase certificates of achievement from Edunancial. Recognized credentials for financial competency.",
};

const TYPE_LABELS: Record<CertificateType, string> = {
  course_completion: "Course Completion",
  learning_path: "Learning Path",
  category_mastery: "Category Mastery",
  special_achievement: "Special Achievement",
};

const TYPE_ORDER: CertificateType[] = [
  "course_completion",
  "category_mastery",
  "learning_path",
  "special_achievement",
];

export default function CertificatesPage() {
  const grouped = CERTIFICATE_TEMPLATES.reduce<Record<CertificateType, typeof CERTIFICATE_TEMPLATES>>(
    (acc, tpl) => {
      if (!acc[tpl.type]) acc[tpl.type] = [];
      acc[tpl.type].push(tpl);
      return acc;
    },
    {} as Record<CertificateType, typeof CERTIFICATE_TEMPLATES>
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          CERTIFICATES
        </p>

        <h1 className="mt-6 text-5xl font-black sm:text-6xl">
          Earn Recognition
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Complete courses and learning paths to earn verifiable digital
          certificates. PDF downloads coming soon.
        </p>

        {TYPE_ORDER.map((type) => {
          const templates = grouped[type];
          if (!templates?.length) return null;

          return (
            <div key={type} className="mt-16">
              <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-yellow-400">
                {TYPE_LABELS[type]}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-6"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-black">{tpl.name}</h3>
                        <p className="mt-2 text-sm text-slate-400">{tpl.description}</p>
                      </div>
                      <span className="text-3xl" role="img" aria-label="Certificate">🎓</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        disabled
                        className="rounded-lg bg-blue-600/50 px-5 py-2 text-sm font-bold text-white cursor-not-allowed opacity-60"
                        title="Enroll in the corresponding course to earn this certificate"
                        aria-label="Complete course to earn this certificate"
                      >
                        Complete Course to Earn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* How it works */}
        <div className="mt-24 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-3xl font-black">How Certificates Work</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "📚", title: "Complete a Course", desc: "Finish all lessons and pass the final assessment." },
              { icon: "🎓", title: "Earn Your Certificate", desc: "Your digital certificate is automatically issued upon completion." },
              { icon: "🔗", title: "Share & Verify", desc: "Share a unique verification link with employers or clients." },
            ].map((step) => (
              <div key={step.title} className="rounded-xl bg-slate-800 p-6 text-center">
                <div className="text-4xl" role="img" aria-label={step.title}>{step.icon}</div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
