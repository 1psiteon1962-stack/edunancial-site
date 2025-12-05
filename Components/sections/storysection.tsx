"use client";

import { useState } from "react";

export default function StorySection() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <section className="bg-white py-16" id="story">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="text-xs underline text-blue-700"
          >
            {lang === "en" ? "Ver en Español" : "See in English"}
          </button>
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
          {lang === "en" ? "Our Story" : "Nuestra Historia"}
        </h2>

        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {lang === "en"
            ? "It started with a question from my son."
            : "Todo comenzó con una pregunta de mi hijo."}
        </h3>

        <div className="space-y-4 mt-6 text-base text-slate-700 leading-relaxed">
          {lang === "en" ? (
            <>
              <p>
                One day my son saw an online payment come in and asked,
                <strong> “How do I work with my head instead of my back?”</strong>
              </p>
              <p>
                That moment became the seed of Edunancial. I taught him the same
                way I teach adults: discipline first, then habits, then wealth.
              </p>
              <p>
                From one ounce of silver a month, he learned the foundations of
                value, scarcity, and long-term thinking. Then gold. Then
                business.
              </p>
              <p>
                Edunancial now exists to deliver that same advantage to youth,
                young adults, and entrepreneurs in English and Spanish.
              </p>
            </>
          ) : (
            <>
              <p>
                Un día mi hijo vio un pago en línea y me preguntó:
                <strong> “¿Cómo trabajo con la cabeza y no solo con la espalda?”</strong>
              </p>
              <p>
                Ese momento se convirtió en la semilla de Edunancial. Comencé a
                enseñarle igual que a los adultos: disciplina, hábitos y luego
                riqueza.
              </p>
              <p>
                Desde una onza de plata al mes, aprendió el valor, la escasez y
                el pensamiento a largo plazo. Luego oro. Luego negocios.
              </p>
              <p>
                Edunancial existe para ofrecer esa misma ventaja a jóvenes,
                adultos y emprendedores — en inglés y español.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
