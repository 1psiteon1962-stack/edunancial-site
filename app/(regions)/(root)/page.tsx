export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Edunancial
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Financial education built for readiness, structure, and long-term growth.
        </h1>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-700">
          Edunancial helps entrepreneurs, students, families, and new investors understand money,
          credit, business structure, investing, ownership, and global opportunity in practical language.
        </p>

        <div className="mb-12 flex flex-wrap gap-3">
          <span className="rounded-full border px-4 py-2 text-sm">Site: us-main</span>
          <span className="rounded-full border px-4 py-2 text-sm">Region: US</span>
          <span className="rounded-full border px-4 py-2 text-sm">Lang: en</span>
          <span className="rounded-full border px-4 py-2 text-sm">Role: primary</span>
        </div>

        <section className="grid gap-6 sm:grid-cols-3">
          <article className="rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Financial Literacy</h2>
            <p className="text-slate-700">
              Learn money, credit, investing, budgeting, ownership, and wealth-building basics.
            </p>
          </article>

          <article className="rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Business Structure</h2>
            <p className="text-slate-700">
              Understand entities, compliance, systems, protection, and business durability.
            </p>
          </article>

          <article className="rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">Global Growth</h2>
            <p className="text-slate-700">
              Explore practical frameworks for building across markets, cultures, and economies.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
