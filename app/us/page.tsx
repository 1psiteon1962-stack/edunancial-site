import AccessGate from "@/components/AccessGate";

export default function USHome() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Edunancial – United States</h1>

      <AccessGate area="LEVEL1">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold">Level 1 – Foundations</h2>
          <p>Money, discipline, mindset, survival economics.</p>
        </section>
      </AccessGate>

      <AccessGate area="LEVEL2">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold">Level 2 – Business Building</h2>
          <p>From hustle to company.</p>
        </section>
      </AccessGate>

      <AccessGate area="LEVEL3">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold">Level 3 – Systems</h2>
          <p>Scaling, automation, compliance.</p>
        </section>
      </AccessGate>

      <AccessGate area="LEVEL4">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold">Level 4 – Capital Readiness</h2>
          <p>Investor structure, legal, valuation.</p>
        </section>
      </AccessGate>

      <AccessGate area="LEVEL5">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold">Level 5 – Global Capital</h2>
          <p>Deal flow, venture syndication, funds.</p>
        </section>
      </AccessGate>
    </div>
  );
}
