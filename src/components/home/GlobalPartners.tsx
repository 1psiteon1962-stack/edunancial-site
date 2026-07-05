export default function GlobalPartners() {
  const partners = [
    "Banks",
    "Credit Unions",
    "Universities",
    "Schools",
    "Government Agencies",
    "Non-Profit Organizations",
    "Professional Associations",
    "Corporate Partners",
  ];

  return (
    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          GLOBAL PARTNERS
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Working Together
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {partners.map((partner) => (

            <div
              key={partner}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              <h3 className="text-xl font-bold">
                {partner}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
