export default function GlobalExpansionCard() {

  return (

    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Global Expansion

      </h2>

      <div className="mt-8 space-y-5">

        <CountryRow
          country="United States"
          status="Live"
        />

        <CountryRow
          country="Canada"
          status="Development"
        />

        <CountryRow
          country="Uganda"
          status="Planning"
        />

        <CountryRow
          country="Nigeria"
          status="Planning"
        />

        <CountryRow
          country="Spain"
          status="Research"
        />

      </div>

    </section>

  );

}

function CountryRow({

  country,

  status,

}: {

  country: string;

  status: string;

}) {

  return (

    <div className="flex justify-between rounded-xl bg-slate-100 p-4">

      <span>{country}</span>

      <strong>{status}</strong>

    </div>

  );

}
