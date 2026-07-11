import { createSEO } from "@/lib/seo";

export const metadata = createSEO(
  "Asia-Pacific | Private Regional Foundation",
  "Edunancial Asia-Pacific regional foundation is integrated and private-by-default pending controlled rollout.",
  "/asia-pacific",
  {
    en: "/asia-pacific",
    zh: "/asia-pacific?lang=zh",
    ja: "/asia-pacific?lang=ja",
    ko: "/asia-pacific?lang=ko",
    hi: "/asia-pacific?lang=hi",
  }
);

export default function AsiaPacificPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Asia-Pacific Foundation
        </p>
        <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
          Private-by-default launch posture.
        </h1>
        <p className="mt-8 text-xl leading-9 text-slate-300">
          Access is controlled through founder and beta rollout gates while localization,
          pricing, tax, and compliance frameworks remain staged.
        </p>
      </section>
    </main>
  );
}
