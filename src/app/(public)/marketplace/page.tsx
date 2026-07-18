import Link from "next/link";

import { MARKETPLACE_CATEGORIES, getMarketplaceItems } from "@/lib/marketplace/catalog";

export const metadata = {
  title: "Marketplace | Edunancial",
  description:
    "Browse Edunancial digital products across books, courses, templates, downloads, software, tools, and more.",
};

export default async function MarketplacePage() {
  const items = await getMarketplaceItems();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">MARKETPLACE</p>
        <h1 className="mt-6 text-6xl font-black">Digital Products Marketplace</h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          One marketplace architecture, multiple categories. New approved marketplace uploads are indexed automatically.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {MARKETPLACE_CATEGORIES.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            return (
              <article key={category} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="text-2xl font-black capitalize">{category.replaceAll("-", " ")}</h2>
                <p className="mt-2 text-sm text-slate-400">{categoryItems.length} items</p>
                <ul className="mt-4 space-y-2 text-slate-200">
                  {categoryItems.length === 0 ? <li className="text-sm text-slate-500">No approved items yet.</li> : categoryItems.slice(0, 5).map((item) => <li key={item.id}>{item.title}</li>)}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/marketplace/professionals" className="rounded-xl border border-white/25 px-6 py-3 font-semibold hover:border-white/40">
            Professional Directory
          </Link>
          <Link href="/library" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
            Browse Digital Library
          </Link>
        </div>
      </section>
    </main>
  );
}
