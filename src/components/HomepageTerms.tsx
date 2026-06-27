import PackCard from "./PackCard";

export default function HomepageTerms() {

  return (

    <section className="bg-[#111827] text-white py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[0.18em] text-[#C49A28] font-bold">
          Financial Terms
        </p>

        <h2 className="text-5xl md:text-6xl font-black mt-6">
          Learn the Language of Wealth
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          <PackCard
            color="#dc2626"
            title="Real Estate"
            terms={50}
            price="$0.99"
            checkoutUrl="#"
          />

          <PackCard
            color="#ffffff"
            title="Paper Assets"
            terms={50}
            price="$0.99"
            checkoutUrl="#"
          />

          <PackCard
            color="#2563eb"
            title="Business"
            terms={50}
            price="$0.99"
            checkoutUrl="#"
          />

        </div>

      </div>

    </section>

  );

}
