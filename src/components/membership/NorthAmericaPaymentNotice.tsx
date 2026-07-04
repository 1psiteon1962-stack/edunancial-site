export default function NorthAmericaPaymentNotice() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-blue-700 bg-blue-950/40 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          North America
        </p>

        <h2 className="mt-4 text-3xl font-bold">
          United States and Canada Are Phase One
        </h2>

        <p className="mt-6 leading-8 text-slate-300">
          Edunancial is being built with North America as the first operating
          region. The United States and Canada are treated as part of the same
          launch phase, with country-specific pricing, payment availability,
          banking configuration, taxes, and membership settings managed through
          the platform.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-slate-950/70 p-6">
            <h3 className="text-xl font-bold">
              United States
            </h3>

            <p className="mt-3 text-slate-300">
              Square-based online payments, USD pricing, and U.S. business bank
              settlement.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-6">
            <h3 className="text-xl font-bold">
              Canada
            </h3>

            <p className="mt-3 text-slate-300">
              Canadian launch support, CAD pricing, Canadian payment support,
              and future province-level marketplace localization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
