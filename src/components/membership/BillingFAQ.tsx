export default function BillingFAQ() {
  const questions = [
    {
      question: "Can I cancel my membership?",
      answer:
        "Yes. Members will be able to cancel future renewals from their billing settings. Access will remain active through the end of the paid billing period.",
    },
    {
      question: "Will my membership renew automatically?",
      answer:
        "Paid memberships are designed to renew automatically unless cancelled before the next renewal date.",
    },
    {
      question: "What payment methods will be accepted?",
      answer:
        "For the United States, Edunancial is being built around Square-supported card payments. Additional payment providers will be added by country as the platform expands.",
    },
    {
      question: "Will Canada be included?",
      answer:
        "Yes. Canada is part of the North America launch plan and will be included in the membership and payment architecture.",
    },
    {
      question: "Can I upgrade later?",
      answer:
        "Yes. Members will be able to upgrade from Free to paid memberships, or move between paid membership levels as more features become available.",
    },
    {
      question: "Are downloads included?",
      answer:
        "Yes. Membership includes access to downloadable guides, worksheets, checklists, calculators, and other financial competency resources based on the membership level.",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Billing Questions
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Membership & Payment FAQ
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Clear membership terms help members understand what they are joining,
          how payments work, and what benefits they receive.
        </p>
      </div>

      <div className="mt-14 space-y-6">
        {questions.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"
          >
            <h3 className="text-xl font-bold text-white">
              {item.question}
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
