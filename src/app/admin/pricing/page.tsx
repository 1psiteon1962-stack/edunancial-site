import { paymentCatalog } from "@/lib/payments/catalog";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export default function PricingAdministrationPage() {
  const memberships = paymentCatalog.filter((item) =>
    item.type.startsWith("membership_")
  );
  const otherItems = paymentCatalog.filter(
    (item) => !item.type.startsWith("membership_")
  );

  return (
    <main className="min-h-screen bg-[#08101f] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
          Checkout source of truth
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Pricing Administration
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-gray-300">
          These are the prices currently used by Edunancial checkout. Pricing is
          read directly from the unified payment catalog so this screen cannot
          drift away from the values customers are actually charged.
        </p>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Memberships</h2>
              <p className="mt-1 text-sm text-gray-400">
                Current production catalog values
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
              Hard-wired to checkout catalog
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-white/10 bg-black/20 text-sm uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Billing</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4">
                        <div className="font-bold">{item.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{item.id}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold capitalize text-gray-200">
                        {item.membershipPlanId ?? "—"}
                      </td>
                      <td className="px-5 py-4 capitalize text-gray-300">
                        {item.recurringInterval ?? (item.isRecurring ? "Recurring" : "One-time")}
                      </td>
                      <td className="px-5 py-4 text-xl font-black">
                        {formatPrice(item.price, item.currency)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                            item.active
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-red-400/10 text-red-300"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {otherItems.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl font-black">Other checkout items</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {otherItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#101a2f] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black">{item.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">{item.id}</p>
                    </div>
                    <div className="text-lg font-black">
                      {formatPrice(item.price, item.currency)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">{item.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                    {item.active ? "Active" : "Inactive"} · {item.type.replaceAll("_", " ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5 text-sm text-blue-100">
          Regional pricing fields have been removed from this screen because no
          separate regional checkout prices are currently wired into the payment
          catalog. Edunancial will not display editable controls that do not
          change what customers are actually charged.
        </section>
      </div>
    </main>
  );
}
