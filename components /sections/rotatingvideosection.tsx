"use client";

import VideoCarousel from "../VideoCarousel";
import { useState } from "react";

export default function RotatingVideoSection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section className="bg-slate-900 py-16 text-white" id="videos">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="text-xs underline text-yellow-300"
          >
            {lang === "en" ? "Ver en Español" : "See in English"}
          </button>
        </div>

        <h2 className="text-center text-3xl font-bold">
          {lang === "en" ? "Video Lessons" : "Lecciones en Video"}
        </h2>
        <p className="mt-2 text-center text-slate-300">
          {lang === "en"
            ? "Short 15-second insights that rotate and teach key financial lessons."
            : "Videos cortos de 15 segundos que rotan y enseñan lecciones financieras claves."}
        </p>

        <div className="mt-10">
          <VideoCarousel />
        </div>
      </div>
    </section>
  );
}
