export const metadata = {
  title: "Partners | Edunancial",
};

const partners = [
  "Schools",
  "Universities",
  "Businesses",
  "Nonprofits",
  "Government",
  "Financial Professionals",
  "Community Organizations",
  "International Partners",
];

export default function PartnersPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          PARTNERS
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Working Together
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {partners.map((partner) => (

            <div
              key={partner}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              <h2 className="text-2xl font-black">

                {partner}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
