"use client";

import { useState } from "react";

export default function AppsSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section id="apps" className="bg-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Language Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="text-xs underline text-blue-700"
          >
            {lang === "en" ? "Ver en Español" : "See in English"}
          </button>
        </div>

        <h2 className="text-center text-3xl font-bold text-slate-900">
          {lang === "en"
            ? "Tools to Improve Your Financial Skills"
            : "Herramientas para Mejorar tus Habilidades Financieras"}
        </h2>

        <p className="mt-2 text-center text-slate-600">
          {lang === "en"
            ? "Interactive apps that teach math, business, and financial decision-making."
            : "Aplicaciones interactivas que enseñan matemáticas, negocios y toma de decisiones financieras."}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* EduMath */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">EduMath</h3>
            <p className="mt-2 text-slate-700">
              {lang === "en"
                ? "A practical math trainer designed to help students and entrepreneurs improve their financial calculation skills."
                : "Un entrenador de matemáticas práctico diseñado para ayudar a estudiantes y emprendedores a mejorar sus habilidades de cálculo financiero."}
            </p>
            <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
              {lang === "en" ? "Learn More" : "Aprender Más"}
            </button>
          </div>

          {/* Edunancial Edge */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">
              Edunancial Edge
            </h3>
            <p className="mt-2 text-slate-700">
              {lang === "en"
                ? "A business intelligence tool that helps entrepreneurs track KPIs, structure their growth, and operate like a scalable company."
                : "Una herramienta de inteligencia empresarial que ayuda a los emprendedores a rastrear KPIs, estructurar su crecimiento y operar como una empresa escalable."}
            </p>
            <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
              {lang === "en" ? "Learn More" : "Aprender Más"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
