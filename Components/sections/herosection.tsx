"use client";

import { useState } from "react";

export default function HeroSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Background shapes */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl" />
      <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl" />

      {/* Language selector */}
      <div className="absolute right-6 top-6 z-20 flex gap-2">
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            lang === "en"
              ? "bg-yellow-300 text-slate-900"
              : "bg-slate-800/60 text-slate-200"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => setLang("es")}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            lang === "es"
              ? "bg-yellow-300 text-slate-900"
              : "bg-slate-800/60 text-slate-200"
          }`}
        >
          ES
        </button>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:flex lg:items-center lg:py-32">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Edunancial
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            {lang === "en" ? (
              <>
                Financial Education{" "}
                <span className="block text-yellow-300">
                  for the Next Generation
                </span>
              </>
            ) : (
              <>
                Educación Financiera{" "}
                <span className="block text-yellow-300">
                  para la Próxima Generación
                </span>
              </>
            )}
          </h1>

          <p className="text-lg text-slate-200">
            {lang === "en"
              ? "Simple, bilingual, real-world training for youth, young adults, and entrepreneurs."
              : "Capacitación bilingüe, clara y práctica para jóvenes, adultos y emprendedores."}
          </p>

          <div className="flex gap-4 pt-4">
            <a
              href="#courses"
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500"
            >
              {lang === "en" ? "Start Learning" : "Comenzar"}
            </a>
            <a
              href="#apps"
              className="rounded-full border border-slate-400 px-8 py-3 text-sm font-semibold hover:bg-white hover:text-slate-900"
            >
              {lang === "en" ? "Explore Tools" : "Explorar Herramientas"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
