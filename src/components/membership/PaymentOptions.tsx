export default function PaymentOptions() {
  const methods = [
    {
      title: "Credit & Debit Cards",
      description:
        "Visa, Mastercard, American Express, Discover and other supported card providers.",
    },
    {
      title: "PayPal",
      description:
        "Secure checkout using your PayPal account or linked payment methods.",
    },
    {
      title: "Apple Pay",
      description:
        "Fast checkout on supported Apple devices.",
    },
    {
      title: "Google Pay",
      description:
        "Quick payment on supported Android devices.",
    },
    {
      title: "Regional Payment Methods",
      description:
        "Additional country-specific payment providers will automatically become available as Edunancial expands globally.",
    },
    {
      title: "Multiple Currencies",
      description:
        "Pricing may be displayed in your local currency where supported while settlements are handled by the appropriate regional business entity.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Payment Options
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Secure Payments Worldwide
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Purchase memberships, courses, books, assessments, and future
          services using secure payment providers. As Edunancial expands
          internationally, payment methods will automatically grow with each
          regional platform.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <div
            key={method.title}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 transition hover:border-blue-500"
          >
            <h3 className="text-xl font-bold text-white">
              {method.title}
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              {method.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-green-700 bg-green-950/30 p-8">
        <h3 className="text-2xl font-bold text-white">
          Safe and Secure Checkout
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          All payment processing is handled through trusted payment providers.
          Edunancial does not store your credit card information. Transactions
          are encrypted using industry-standard security practices.
        </p>
      </div>
    </section>
  );
}
