"use client";

import { useState } from "react";

export default function FooterSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-12">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="text-xs underline text-yellow-400"
          >
            {lang === "en" ? "Ver en Español" : "See in English"}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-white">
          {lang === "en" ? "Edunancial, Inc." : "Edunancial, Inc."}
        </h3>

        <p className="mt-2 text-sm">
          {lang === "en"
            ? "Financial education empowering new generations through bilingual learning."
            : "Educación financiera que empodera a nuevas generaciones a través del aprendizaje bilingüe."}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Edunancial, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
