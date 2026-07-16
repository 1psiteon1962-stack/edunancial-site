import type { Metadata } from "next";

import ShopSection from "@/components/marketplace/ShopSection";

export const metadata: Metadata = {
  title: "Shop | Edunancial Marketplace",
  description:
    "Edunancial branded merchandise — apparel, headwear, drinkware, stationery, accessories, and gift cards. Worldwide fulfillment.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-green-400">
          Marketplace › Shop
        </p>
        <h1 className="text-5xl font-black md:text-6xl">
          Wear the Mission.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
          Edunancial branded merchandise builds community, reinforces member
          identity, and creates everyday visibility for financial education
          worldwide. Every item ships anywhere on the planet.
        </p>

        <div className="mt-16">
          <ShopSection />
        </div>
      </section>
    </main>
  );
}
