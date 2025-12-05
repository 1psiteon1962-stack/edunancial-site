"use client";

import { useState } from "react";

export default function CoursesSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section id="courses" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="text-xs underline text-blue-700"
          >
            {lang === "en" ? "Ver en Español" : "See in English"}
          </button>
        </div>

        <h2 className="text-center text-3xl font-bold text-slate-900">
          {lang === "en" ? "Courses" : "Cursos"}
        </h2>
        <p className="mt-2 text-center text-slate-600">
          {lang === "en"
            ? "Learn money, business, and investing the simple way."
            : "Aprende dinero, negocios e inversión de forma sencilla."}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {/* Red Track - Real Estate */}
          <div className="rounded-xl bg-slate-100 p-6 shadow transition hover:shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=60"
              className="h-40 w-full rounded-lg object-cover"
              alt="Real Estate"
            />
            <h3 className="mt-4 text-xl font-semibold text-red-600">
              {lang === "en" ? "Real Estate" : "Bienes Raíces"}
            </h3>
            <p className="mt-2 text-slate-700">
              {lang === "en"
                ? "Learn tax liens, tax deeds, flipping, rentals, and wealth through property."
                : "Aprende tax liens, tax deeds, flipping, alquileres y riqueza a través de bienes raíces."}
            </p>
          </div>

          {/* White Track - Paper Assets */}
          <div className="rounded-xl bg-slate-100 p-6 shadow transition hover:shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60"
              className="h-40 w-full rounded-lg object-cover"
              alt="Investing"
            />
            <h3 className="mt-4 text-xl font-semibold text-slate-600">
              {lang === "en" ? "Paper Assets" : "Activos en Papel"}
            </h3>
            <p className="mt-2 text-slate-700">
              {lang === "en"
                ? "Stocks, options, bonds, and mastering financial markets at a beginner-friendly level."
                : "Acciones, opciones, bonos y dominar los mercados financieros a nivel principiante."}
            </p>
          </div>

          {/* Blue Track - Business */}
          <div className="rounded-xl bg-slate-100 p-6 shadow transition hover:shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60"
              className="h-40 w-full rounded-lg object-cover"
              alt="Business"
            />
            <h3 className="mt-4 text-xl font-semibold text-blue-700">
              {lang === "en" ? "Business" : "Negocios"}
            </h3>
            <p className="mt-2 text-slate-700">
              {lang === "en"
                ? "Learn entities, taxes, scaling, KPIs, sales, marketing, and how to build a company."
                : "Aprende entidades, impuestos, escalamiento, KPIs, ventas, marketing y cómo construir una empresa."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
