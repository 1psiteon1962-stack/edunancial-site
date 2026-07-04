export default function AIAgentsCard() {

  const agents = [

    "CEO Agent",

    "COO Agent",

    "CIO Agent",

    "CFO Agent",

    "Marketing Agent",

    "Sales Agent",

    "HR Agent",

    "Research Agent",

  ];

  return (

    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        AI Executive Team

      </h2>

      <p className="mt-4 text-slate-600">

        Status of your AI executive assistants.

      </p>

      <div className="mt-8 space-y-4">

        {agents.map(agent => (

          <div
            key={agent}
            className="flex items-center justify-between rounded-xl bg-slate-100 p-4"
          >

            <span>{agent}</span>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">

              Planned

            </span>

          </div>

        ))}

      </div>

    </section>

  );

}
