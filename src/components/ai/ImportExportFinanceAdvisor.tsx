export default function ImportExportFinanceAdvisor() {

  const items = [

    "Letters of Credit",

    "Trade Finance",

    "Purchase Orders",

    "Export Financing",

    "Import Financing",

    "Currency Hedging",

    "Supplier Credit",

    "Trade Risk",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI IMPORT / EXPORT FINANCE

        </p>

        <h2 className="mt-6 text-5xl font-black">

          Global Trade

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {items.map((item)=>(

            <div key={item} className="rounded-xl bg-slate-900 p-8">

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
