import type { Language } from "@/lib/languages";
import { regionContent, type RegionCurriculumContent, type RegionKey } from "@/lib/regionContent";

type Props = {
  regionKey: RegionKey;
  lang: Language;
  content?: RegionCurriculumContent; // optional: auto-resolve if not provided
};

export default function RegionCurriculum({ regionKey, lang, content }: Props) {
  const resolved: RegionCurriculumContent = content ?? regionContent[regionKey][lang];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{resolved.headline}</h1>
        <p className="mt-3 text-lg opacity-90">{resolved.subheadline}</p>
      </header>

      <section className="mb-8 rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-3">Highlights</h2>
        <ul className="list-disc ml-6 space-y-1">
          {resolved.highlights.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-3">Curriculum</h2>
        <ul className="list-disc ml-6 space-y-1">
          {resolved.curriculum.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-2">Pricing</h2>
        <div className="text-base leading-7">
          <div>
            <strong>{resolved.pricing.currency}</strong>
          </div>
          <div>Monthly: {resolved.pricing.monthly}</div>
          <div>Annual: {resolved.pricing.annual}</div>
          {typeof resolved.pricing.quarterly === "number" && (
            <div>Quarterly: {resolved.pricing.quarterly}</div>
          )}
          {typeof resolved.pricing.lifetime === "number" && (
            <div>Lifetime: {resolved.pricing.lifetime}</div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={resolved.ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 font-semibold"
          >
            {resolved.ctaPrimary.label}
          </a>
          {resolved.ctaSecondary && (
            <a
              href={resolved.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2"
            >
              {resolved.ctaSecondary.label}
            </a>
          )}
        </div>

        <p className="mt-4 text-sm opacity-80">{resolved.legalNote}</p>
      </section>
    </main>
  );
}
