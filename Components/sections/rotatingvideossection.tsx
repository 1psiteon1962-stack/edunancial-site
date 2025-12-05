// components/sections/RotatingVideosSection.tsx
import VideoCarousel from "../VideoCarousel";

export default function RotatingVideosSection() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="mx-auto max-w-6xl px-6 text-center text-slate-50">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
          Watch How It Works
        </h2>
        <h3 className="mt-2 text-3xl font-bold">
          Short lessons, rotating in 15 seconds.
        </h3>
        <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
          This section will rotate short 15-second video clips — previews of
          classes, tools, and real examples — in English and Spanish, so
          visitors can feel how Edunancial teaches.
        </p>
        <div className="mt-8">
          <VideoCarousel />
        </div>
      </div>
    </section>
  );
}
