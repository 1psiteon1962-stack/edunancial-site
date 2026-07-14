"use client";

import Link from "next/link";
import { courseList } from "@/data/course-platform";
import { useState } from "react";
import { useNorthAmericaLaunchLanguage } from "@/components/international/BilingualContent";

// Mock completed courses
const completedCourseIds = ["financial-foundations"];
const completedCourses = courseList.filter((c) => completedCourseIds.includes(c.id));

function CertificateCard({ courseId, language }: { courseId: string; language: "en" | "es" }) {
  const course = courseList.find((c) => c.id === courseId);
  if (!course) return null;
  const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const memberName = language === "es" ? "Miembro de Norteamérica" : "North America Member";
  const certificateId = `EDU-${course.id.toUpperCase().slice(0, 6)}-2026`;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-700 bg-gradient-to-br from-slate-900 via-[#0d1a30] to-slate-900 p-10 text-center shadow-2xl shadow-black/30">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
        <span className="text-[20rem] font-black leading-none">
          {course.title[0]}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">EDUNANCIAL</p>
        <p className="mt-2 text-sm text-slate-400">{language === "es" ? "Certificado de finalización" : "Certificate of Completion"}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <p className="text-sm text-slate-400">{language === "es" ? "Se certifica que" : "This certifies that"}</p>
        <p className="mt-2 text-3xl font-black">{memberName}</p>

        <p className="mt-4 text-sm text-slate-400">{language === "es" ? "ha completado satisfactoriamente" : "has successfully completed"}</p>
        <p className="mt-2 text-2xl font-black text-yellow-400">{course.title}</p>
        <p className="mt-2 text-slate-300 text-sm">{course.subtitle}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <div className="grid gap-4 text-left text-xs text-slate-400 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <p className="font-bold text-slate-200">{language === "es" ? "Nombre del miembro" : "Member Name"}</p>
            <p>{memberName}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{language === "es" ? "Curso" : "Course"}</p>
            <p>{course.title}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{language === "es" ? "Fecha de finalización" : "Completion Date"}</p>
            <p>{issueDate}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="font-bold text-slate-200">{language === "es" ? "Verificación QR" : "QR Verification"}</p>
            <div className="mx-auto mt-3 grid w-20 grid-cols-4 gap-1">
              {[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1].map((cell, index) => (
                <span key={index} className={`h-4 w-4 rounded-sm ${cell ? "bg-white" : "bg-slate-700"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-left text-xs text-slate-400 md:grid-cols-2">
          <div>
            <p className="font-bold text-slate-200">{language === "es" ? "ID del certificado" : "Certificate ID"}</p>
            <p className="font-mono">{certificateId}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{language === "es" ? "Categoría" : "Category"}</p>
            <p>{course.category}</p>
          </div>
        </div>

        <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs leading-6 text-slate-300">
          {language === "es"
            ? "Este certificado reconoce la finalización de un módulo de alfabetización financiera o competencia financiera de Edunancial. No es un grado académico, licencia profesional, credencial regulada ni evidencia de acreditación."
            : "This certificate recognizes completion of an Edunancial financial literacy or financial competency module. It is not an academic degree, professional license, regulated credential, or evidence of accreditation."}
        </p>
      </div>
    </div>
  );
}

export default function MyCertificatesPage() {
  const language = useNorthAmericaLaunchLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(
    completedCourseIds[0] ?? null
  );

  if (completedCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <span className="text-6xl">🎓</span>
          <h1 className="mt-6 text-4xl font-black">{language === "es" ? "Aún no hay certificados" : "No Certificates Yet"}</h1>
          <p className="mt-4 text-slate-300 max-w-lg mx-auto">
            {language === "es"
              ? "Complete un curso y apruebe el cuestionario final para obtener su certificado."
              : "Complete a course and pass the final quiz to earn your certificate."}
          </p>
          <Link
            href="/course-catalog"
            className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            {language === "es" ? "Comenzar un curso" : "Start a Course"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">{language === "es" ? "MIS CERTIFICADOS" : "MY CERTIFICATES"}</p>
        <h1 className="mt-4 text-5xl font-black">{language === "es" ? "Certificados obtenidos" : "Certificates Earned"}</h1>
        <p className="mt-4 text-slate-300">
          {language === "es"
            ? `${completedCourses.length} certificado${completedCourses.length !== 1 ? "s" : ""} obtenido${completedCourses.length !== 1 ? "s" : ""}.`
            : `${completedCourses.length} certificate${completedCourses.length !== 1 ? "s" : ""} earned.`}
        </p>

        {/* Certificate list */}
        <div className="mt-12 space-y-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-800 transition"
                onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-400">{language === "es" ? "Certificado de finalización" : "Certificate of Completion"} · {course.category}</p>
                  </div>
                </div>
                <span className="text-slate-400">{expandedId === course.id ? "▲" : "▼"}</span>
              </button>

              {expandedId === course.id && (
                <div className="px-6 pb-8">
                  <CertificateCard courseId={course.id} language={language} />
                  <div className="mt-6 flex gap-4 justify-center">
                    <button className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 transition">
                      {language === "es" ? "📥 Descargar PDF" : "📥 Download PDF"}
                    </button>
                    <button className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition">
                      {language === "es" ? "🔗 Copiar enlace de verificación" : "🔗 Copy Verify Link"}
                    </button>
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition"
                    >
                      {language === "es" ? "Revisar curso" : "Review Course"}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/certificates" className="text-yellow-400 hover:text-yellow-300 text-sm font-bold">
            {language === "es" ? "Ver todos los certificados disponibles →" : "View All Available Certificates →"}
          </Link>
        </div>
      </section>
    </main>
  );
}
