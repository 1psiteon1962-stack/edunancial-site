export default function USHome() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold">Edunancial United States</h1>

      <p className="mt-4 text-gray-600">
        The U.S. Founder Platform for Education, Capital, and Global Expansion.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Founder Levels</h2>
        <ul className="mt-4 space-y-2">
          <li>Level 1 — Survival Entrepreneur</li>
          <li>Level 2 — Stable Operator</li>
          <li>Level 3 — Growth Builder</li>
          <li>Level 4 — Scalable Enterprise</li>
          <li>Level 5 — Capital Architect</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Platform Tools</h2>
        <ul className="mt-4 space-y-2">
          <li>EduVesting — Investment analysis</li>
          <li>EduMath — Financial literacy</li>
          <li>Founder Readiness Score</li>
          <li>Global Expansion Routing</li>
        </ul>
      </section>

      <section className="mt-10">
        <a
          href="/start"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg"
        >
          Start Your Company
        </a>
      </section>
    </main>
  )
}
