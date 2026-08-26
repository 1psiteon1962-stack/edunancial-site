import MarketplaceProductUploader from "@/components/marketplace/MarketplaceProductUploader";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

type ProductRow = {
  id: string;
  title: string;
  product_type: string;
  status: string;
  price_cents: number;
  currency: string;
  updated_at: string;
};

export const dynamic = "force-dynamic";

export default async function MarketplaceAdministrationPage() {
  await requireOwnerPageSession();
  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("marketplace_products")
    .select("id,title,product_type,status,price_cents,currency,updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);
  const products = (data ?? []) as ProductRow[];

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">Owner publishing</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Marketplace Workbench</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-300">
          Upload eBooks, audiobooks, courses, templates, workbooks, downloads and business tools into private storage and save their commercial metadata as drafts. Draft creation is operational; public sale remains disabled until checkout and fulfillment are wired end to end.
        </p>

        <section className="mt-10">
          <MarketplaceProductUploader />
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Marketplace drafts</h2>
              <p className="mt-1 text-sm text-gray-400">Most recently updated products</p>
            </div>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-200">
              Publishing gated
            </span>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
              Marketplace database is not ready in this environment: {error.message}
            </p>
          ) : products.length ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wide text-gray-400">
                    <tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Updated</th></tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-white/5 last:border-0">
                        <td className="px-5 py-4 font-bold">{product.title}</td>
                        <td className="px-5 py-4 text-gray-300">{product.product_type.replaceAll("_", " ")}</td>
                        <td className="px-5 py-4 font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(product.price_cents / 100)}</td>
                        <td className="px-5 py-4"><span className="rounded-full bg-white/5 px-3 py-1 text-xs font-black">{product.status}</span></td>
                        <td className="px-5 py-4 text-sm text-gray-400">{new Date(product.updated_at).toLocaleString("en-US")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-xl border border-white/10 bg-[#101a2f] p-5 text-gray-400">No Marketplace drafts yet. The uploader above is ready once the database migration and private storage bucket are deployed.</p>
          )}
        </section>
      </div>
    </main>
  );
}
