export default function PartnersSection() {

  const partners = [
    "Schools",
    "Employers",
    "Nonprofits",
    "Veterans",
    "Governments",
    "Universities"
  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">
          Strategic Partners
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {partners.map((partner)=>(

            <div
              key={partner}
              className="rounded-xl bg-[#111827] p-8"
            >

              <h3 className="text-2xl font-bold">
                {partner}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
