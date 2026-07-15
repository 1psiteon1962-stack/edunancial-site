import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Certificates | Edunancial",
};

const completedCourseIds = new Set(["financial-foundations"]);

function CertificatesLayout({
  label,
  title,
  description,
  earnedHeading,
  earnedLabel,
  completedLabel,
  downloadLabel,
  reviewLabel,
  availableHeading,
  availableTemplate,
  startLabel,
  verificationHeading,
  verificationBody,
  myCertificatesLabel,
}: {
  label: string;
  title: string;
  description: string;
  earnedHeading: string;
  earnedLabel: string;
  completedLabel: string;
  downloadLabel: string;
  reviewLabel: string;
  availableHeading: string;
  availableTemplate: (count: number) => string;
  startLabel: string;
  verificationHeading: string;
  verificationBody: string;
  myCertificatesLabel: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">{description}</p>

        {completedCourseIds.size > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-black text-green-400">🎓 {earnedHeading}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {courseList.filter((c) => completedCourseIds.has(c.id)).map((course) => (
                <div key={course.id} className="rounded-2xl border border-yellow-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                  <div className={`mb-4 inline-block rounded-lg px-3 py-1 text-xs font-bold ${course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color}`}>
                    {course.category}
                  </div>
                  <h2 className="text-2xl font-black">{course.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{earnedLabel}</p>
                  <p className="mt-1 text-sm font-bold text-yellow-400">✅ {completedLabel}</p>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 rounded-xl bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-400">
                      {downloadLabel}
                    </button>
                    <Link href={`/courses/${course.id}`} className="rounded-xl border border-slate-600 px-4 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
                      {reviewLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-black">{availableHeading}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseList.filter((c) => !completedCourseIds.has(c.id)).map((course) => (
              <div key={course.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className={`mb-4 h-1 w-full rounded-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color}`} />
                <h2 className="text-lg font-black">{course.title}</h2>
                <p className="mt-2 flex-1 text-sm text-slate-400">{availableTemplate(course.lessons.length)}</p>
                <div className="mt-6 space-y-3">
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-slate-600" style={{ width: "0%" }} />
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/courses/${course.id}`} className="flex-1 rounded-xl border border-slate-600 bg-slate-800 py-2.5 text-center text-sm font-bold text-slate-300 transition hover:bg-slate-700">
                      {startLabel}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h3 className="text-xl font-black">{verificationHeading}</h3>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{verificationBody}</p>
          <Link href="/my-certificates" className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black transition hover:bg-yellow-400">
            {myCertificatesLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function CertificatesPage() {
  return (
    <BilingualContent
      en={
        <CertificatesLayout
          label="CERTIFICATES"
          title="Earn Recognition"
          description="Complete every lesson and pass the final quiz to earn your certificate. Certificates are shareable and verifiable."
          earnedHeading="Certificates Earned"
          earnedLabel="Certificate of Completion"
          completedLabel="Completed"
          downloadLabel="Download PDF"
          reviewLabel="Review"
          availableHeading="Available Certificates"
          availableTemplate={(count) => `Complete ${count} lessons to earn this certificate.`}
          startLabel="Start Course"
          verificationHeading="Certificate Verification"
          verificationBody="All Edunancial certificates include a unique verification code. Share with employers, partners, and networks to prove your financial competency."
          myCertificatesLabel="View My Certificates"
        />
      }
      es={
        <CertificatesLayout
          label="CERTIFICADOS"
          title="Obtenga reconocimiento"
          description="Complete cada lección y apruebe el cuestionario final para obtener su certificado. Los certificados son compartibles y verificables."
          earnedHeading="Certificados obtenidos"
          earnedLabel="Certificado de finalización"
          completedLabel="Completado"
          downloadLabel="Descargar PDF"
          reviewLabel="Revisar"
          availableHeading="Certificados disponibles"
          availableTemplate={(count) => `Complete ${count} lecciones para obtener este certificado.`}
          startLabel="Comenzar curso"
          verificationHeading="Verificación del certificado"
          verificationBody="Todos los certificados de Edunancial incluyen un código único de verificación. Compártalos con empleadores, socios y redes para demostrar su competencia financiera."
          myCertificatesLabel="Ver mis certificados"
        />
      }
      fr={
        <CertificatesLayout
          label="CERTIFICATS"
          title="Obtenez une reconnaissance"
          description="Suivez toutes les leçons et réussissez le quiz final pour obtenir votre certificat. Les certificats sont partageables et vérifiables."
          earnedHeading="Certificats obtenus"
          earnedLabel="Certificat d'achèvement"
          completedLabel="Terminé"
          downloadLabel="Télécharger le PDF"
          reviewLabel="Revoir"
          availableHeading="Certificats disponibles"
          availableTemplate={(count) => `Suivez ${count} leçons pour obtenir ce certificat.`}
          startLabel="Commencer un cours"
          verificationHeading="Vérification du certificat"
          verificationBody="Tous les certificats Edunancial incluent un code de vérification unique. Partagez-les avec des employeurs, des partenaires et votre réseau pour démontrer votre compétence financière."
          myCertificatesLabel="Voir mes certificats"
        />
      }
    />
  );
}
