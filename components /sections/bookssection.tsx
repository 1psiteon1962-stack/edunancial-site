"use client";

import { useState } from "react";

export default function BooksSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section className="bg-slate-50 py-16" id="books">
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
          {lang === "en" ? "Books" : "Libros"}
        </h2>

        <p className="mt-2 text-center text-slate-600">
          {lang === "en"
            ? "Practical financial education for teens, young adults, and entrepreneurs."
            : "Educación financiera práctica para jóvenes, adultos y emprendedores."}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">

          {/* Options Trading */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <img
              src="/img/book-options-trading.png"
              className="h-52 w-full rounded-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {lang === "en"
                ? "Options Trading (White Series)"
                : "Opciones Financieras (Serie Blanca)"}
            </h3>
          </div>

          {/* Business is About Profit */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <img
              src="/img/book-business-profit.png"
              className="h-52 w-full rounded-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {lang === "en"
                ? "Business is About Making Profit (Blue Series)"
                : "El Negocio se Trata de Generar Ganancias (Serie Azul)"}
            </h3>
          </div>

          {/* Tax Liens & Tax Deeds */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <img
              src="/img/book-tax-liens.png"
              className="h-52 w-full rounded-lg object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {lang === "en"
                ? "Building Wealth with Tax Liens & Tax Deeds (Red Series)"
                : "Construyendo Riqueza con Tax Liens & Tax Deeds (Serie Roja)"}
            </h3>
          </div>

        </div>
      </div>
    </section>
  );
}
