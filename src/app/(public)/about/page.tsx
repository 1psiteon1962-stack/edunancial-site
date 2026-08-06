"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function AboutPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="uppercase tracking-[0.4em] text-yellow-400 font-bold">{t("about.label")}</p>
        <h1 className="mt-6 text-6xl font-black">
          {t("about.heroLine1")}
          <br />
          {t("about.heroLine2")}
        </h1>
        <p className="mt-12 text-2xl leading-10 text-slate-300">{t("about.intro1")}</p>
        <p className="mt-8 text-2xl leading-10 text-slate-300">{t("about.intro2")}</p>
      </section>

      <section className="bg-[#111827]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-5xl font-black">{t("about.whyWeExist")}</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-xl bg-slate-900 p-8">
                <h3 className={`text-3xl font-black ${index === 1 ? "text-red-500" : index === 2 ? "text-white" : "text-blue-500"}`}>
                  {t(`about.card${index}.title`)}
                </h3>
                <p className="mt-6 text-slate-300 leading-8">{t(`about.card${index}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-5xl font-black">{t("about.pillarsTitle")}</h2>
        <div className="mt-16 space-y-10">
          {(["red", "white", "blue"] as const).map((track) => (
            <div key={track}>
              <h3 className={`text-4xl font-black ${track === "red" ? "text-red-500" : track === "blue" ? "text-blue-500" : "text-white"}`}>
                {track.toUpperCase()}
              </h3>
              <p className="mt-4 text-xl leading-9 text-slate-300">{t(`about.${track}Body`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1326]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-5xl font-black">{t("about.finalTitle")}</h2>
          <p className="mt-8 text-2xl leading-10 text-slate-300">{t("about.finalBody")}</p>
          <Link
            href="/why-edunancial"
            className="mt-12 inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            {t("about.finalCta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
