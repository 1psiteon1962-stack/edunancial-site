export default function RegionalCompliance() {

  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Regional Compliance
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <Compliance
          title="GDPR"
          status="Compliant"
        />

        <Compliance
          title="CCPA"
          status="Compliant"
        />

        <Compliance
          title="COPPA"
          status="Review"
        />

        <Compliance
          title="Accessibility"
          status="AA"
        />

      </div>

    </section>
  );
}

function Compliance({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-lg bg-slate-800 p-5">

      <h3 className="font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-blue-400">
        {status}
      </p>

    </div>
  );
}
