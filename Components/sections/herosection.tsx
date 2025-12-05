// components/sections/HeroSection.tsx
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Abstract shapes */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-yellow-400/30 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:py-24">
        {/* Left content */}
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Edunancial
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Financial Education
            <span className="block text-yellow-300">
              for the Next Generation
            </span>
          </h1>
          <p className="max-w-lg text-base text-slate-200 sm:text-lg">
            Simple, bilingual, and actionable training for teens, young adults,
            and entrepreneurs. Learn the math, systems, and business skills that
            build real wealth.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#courses"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/50"
            >
              Start Learning
            </Link>
            <Link
              href="#apps"
              className="inline-flex items-center justify-center rounded-full border border-slate-500/60 bg-slate-900/40 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-slate-900/70"
            >
              Explore Edunancial Apps
            </Link>
          </div>

          <p className="text-xs text-slate-300/80">
            Disponible en inglés y español. | Available in English and Spanish.
          </p>
        </div>

        {/* Right abstract visual / placeholder */}
        <div className="relative hidden flex-1 items-center justify-center lg:flex">
          <div className="relative h-80 w-full max-w-md rounded-3xl bg-slate-900/60 p-6 shadow-2xl ring-1 ring-slate-700/80 backdrop-blur">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Preview
            </div>
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    App
                  </p>
                  <p className="text-sm font-semibold text-white">EduMath</p>
                </div>
                <span className="rounded-full bg-blue-600/80 px-3 py-1 text-[11px] font-semibold">
                  Math for Money
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    App
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Edunancial Edge
                  </p>
                </div>
                <span className="rounded-full bg-yellow-400/80 px-3 py-1 text-[11px] font-semibold text-slate-900">
                  Business KPIs
                </span>
              </div>
              <p className="text-[11px] text-slate-300/90">
                See your money, business, and decisions clearly — then scale
                with discipline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
