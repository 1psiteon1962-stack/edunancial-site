"use client";

import Link from "next/link";
import { useState } from "react";

import {
  type NorthAmericaLaunchLanguage,
  useNorthAmericaLaunchLanguage,
} from "@/components/international/BilingualContent";
import { courseList } from "@/data/course-platform";

const completedCourseIds = ["financial-foundations"];
const completedCourses = courseList.filter((c) => completedCourseIds.includes(c.id));

const copy = {
  certificateOfCompletion: { en: "Certificate of Completion", es: "Certificado de finalización", "fr-CA": "Certificat d'achèvement", "fr-FR": "Certificat d'achèvement" },
  thisCertifiesThat: { en: "This certifies that", es: "Se certifica que", "fr-CA": "Nous certifions que", "fr-FR": "Nous certifions que" },
  hasSuccessfullyCompleted: { en: "has successfully completed", es: "ha completado satisfactoriamente", "fr-CA": "a réussi", "fr-FR": "a réussi" },
  memberName: { en: "North America Member", es: "Miembro de Norteamérica", "fr-CA": "Membre Amérique du Nord", "fr-FR": "Membre Amérique du Nord" },
  memberNameLabel: { en: "Member Name", es: "Nombre del miembro", "fr-CA": "Nom du membre", "fr-FR": "Nom du membre" },
  course: { en: "Course", es: "Curso", "fr-CA": "Cours", "fr-FR": "Cours" },
  completionDate: { en: "Completion Date", es: "Fecha de finalización", "fr-CA": "Date d'achèvement", "fr-FR": "Date d'achèvement" },
  qrVerification: { en: "QR Verification", es: "Verificación QR", "fr-CA": "Vérification QR", "fr-FR": "Vérification QR" },
  certificateId: { en: "Certificate ID", es: "ID del certificado", "fr-CA": "ID du certificat", "fr-FR": "ID du certificat" },
  category: { en: "Category", es: "Categoría", "fr-CA": "Catégorie", "fr-FR": "Catégorie" },
  disclaimer: {
    en: "This certificate recognizes completion of an Edunancial financial literacy or financial competency module. It is not an academic degree, professional license, regulated credential, or evidence of accreditation.",
    es: "Este certificado reconoce la finalización de un módulo de alfabetización financiera o competencia financiera de Edunancial. No es un grado académico, licencia profesional, credencial regulada ni evidencia de acreditación.",
    "fr-CA": "Ce certificat reconnaît l'achèvement d'un module de littératie financière ou de compétence financière d'Edunancial. Il ne constitue pas un diplôme académique, une licence professionnelle, un titre réglementé ni une preuve d'accréditation.",
    "fr-FR": "Ce certificat reconnaît l'achèvement d'un module de littératie financière ou de compétence financière d'Edunancial. Il ne constitue pas un diplôme académique, une licence professionnelle, un titre réglementé ni une preuve d'accréditation.",
  },
  noCertificatesYet: { en: "No Certificates Yet", es: "Aún no hay certificados", "fr-CA": "Aucun certificat pour l'instant", "fr-FR": "Aucun certificat pour l'instant" },
  completeCourse: { en: "Complete a course and pass the final quiz to earn your certificate.", es: "Complete un curso y apruebe el cuestionario final para obtener su certificado.", "fr-CA": "Suivez un cours et réussissez le questionnaire final pour obtenir votre certificat.", "fr-FR": "Suivez un cours et réussissez le questionnaire final pour obtenir votre certificat." },
  startCourse: { en: "Start a Course", es: "Comenzar un curso", "fr-CA": "Commencer un cours", "fr-FR": "Commencer un cours" },
  myCertificates: { en: "MY CERTIFICATES", es: "MIS CERTIFICADOS", "fr-CA": "MES CERTIFICATS", "fr-FR": "MES CERTIFICATS" },
  certificatesEarned: { en: "Certificates Earned", es: "Certificados obtenidos", "fr-CA": "Certificats obtenus", "fr-FR": "Certificats obtenus" },
  earnedCount: {
    en: (count: number) => `${count} certificate${count !== 1 ? "s" : ""} earned.`,
    es: (count: number) => `${count} certificado${count !== 1 ? "s" : ""} obtenido${count !== 1 ? "s" : ""}.`,
    "fr-CA": (count: number) => `${count} certificat${count !== 1 ? "s" : ""} obtenu${count !== 1 ? "s" : ""}.`,
    "fr-FR": (count: number) => `${count} certificat${count !== 1 ? "s" : ""} obtenu${count !== 1 ? "s" : ""}.`,
  },
  downloadPdf: { en: "📥 Download PDF", es: "📥 Descargar PDF", "fr-CA": "📥 Télécharger le PDF", "fr-FR": "📥 Télécharger le PDF" },
  copyVerifyLink: { en: "🔗 Copy Verify Link", es: "🔗 Copiar enlace de verificación", "fr-CA": "🔗 Copier le lien de vérification", "fr-FR": "🔗 Copier le lien de vérification" },
  reviewCourse: { en: "Review Course", es: "Revisar curso", "fr-CA": "Revoir le cours", "fr-FR": "Revoir le cours" },
  viewAll: { en: "View All Available Certificates →", es: "Ver todos los certificados disponibles →", "fr-CA": "Voir tous les certificats disponibles →", "fr-FR": "Voir tous les certificats disponibles →" },
} as const;

function CertificateCard({
  courseId,
  language,
}: {
  courseId: string;
  language: NorthAmericaLaunchLanguage;
}) {
  const course = courseList.find((c) => c.id === courseId);
  if (!course) return null;

  const issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const memberName = copy.memberName[language];
  const certificateId = `EDU-${course.id.toUpperCase().slice(0, 6)}-2026`;
  const t = <K extends keyof typeof copy>(key: K) => copy[key][language] as (typeof copy)[K][NorthAmericaLaunchLanguage];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-700 bg-gradient-to-br from-slate-900 via-[#0d1a30] to-slate-900 p-10 text-center shadow-2xl shadow-black/30">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center opacity-5">
        <span className="text-[20rem] font-black leading-none">{course.title[0]}</span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">EDUNANCIAL</p>
        <p className="mt-2 text-sm text-slate-400">{t("certificateOfCompletion")}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <p className="text-sm text-slate-400">{t("thisCertifiesThat")}</p>
        <p className="mt-2 text-3xl font-black">{memberName}</p>

        <p className="mt-4 text-sm text-slate-400">{t("hasSuccessfullyCompleted")}</p>
        <p className="mt-2 text-2xl font-black text-yellow-400">{course.title}</p>
        <p className="mt-2 text-sm text-slate-300">{course.subtitle}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <div className="grid gap-4 text-left text-xs text-slate-400 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <p className="font-bold text-slate-200">{t("memberNameLabel")}</p>
            <p>{memberName}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("course")}</p>
            <p>{course.title}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("completionDate")}</p>
            <p>{issueDate}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="font-bold text-slate-200">{t("qrVerification")}</p>
            <div className="mx-auto mt-3 grid w-20 grid-cols-4 gap-1">
              {[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1].map((cell, index) => (
                <span key={index} className={`h-4 w-4 rounded-sm ${cell ? "bg-white" : "bg-slate-700"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-left text-xs text-slate-400 md:grid-cols-2">
          <div>
            <p className="font-bold text-slate-200">{t("certificateId")}</p>
            <p className="font-mono">{certificateId}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("category")}</p>
            <p>{course.category}</p>
          </div>
        </div>

        <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs leading-6 text-slate-300">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}

export default function MyCertificatesPage() {
  const language = useNorthAmericaLaunchLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(completedCourseIds[0] ?? null);
  const t = <K extends keyof typeof copy>(key: K) => copy[key][language] as (typeof copy)[K][NorthAmericaLaunchLanguage];

  if (completedCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <span className="text-6xl">🎓</span>
          <h1 className="mt-6 text-4xl font-black">{t("noCertificatesYet")}</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">{t("completeCourse")}</p>
          <Link
            href="/course-catalog"
            className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black transition hover:bg-yellow-400"
          >
            {t("startCourse")}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("myCertificates")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("certificatesEarned")}</h1>
        <p className="mt-4 text-slate-300">{copy.earnedCount[language](completedCourses.length)}</p>

        <div className="mt-12 space-y-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-800"
                onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-400">{t("certificateOfCompletion")} · {course.category}</p>
                  </div>
                </div>
                <span className="text-slate-400">{expandedId === course.id ? "▲" : "▼"}</span>
              </button>

              {expandedId === course.id && (
                <div className="px-6 pb-8">
                  <CertificateCard courseId={course.id} language={language} />
                  <div className="mt-6 flex justify-center gap-4">
                    <button className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400">
                      {t("downloadPdf")}
                    </button>
                    <button className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
                      {t("copyVerifyLink")}
                    </button>
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800"
                    >
                      {t("reviewCourse")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/certificates" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
            {t("viewAll")}
          </Link>
        </div>
      </section>
    </main>
  );
}
