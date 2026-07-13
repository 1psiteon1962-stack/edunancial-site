export default function FrequentlyAskedQuestions() {
  const faqs = [
    {
      question: "What is Financial Competency?",
      answer:
        "Financial competency is the ability to consistently make informed financial decisions through knowledge, discipline and experience.",
    },
    {
      question: "Is membership required?",
      answer:
        "Individual Membership is $19.99/month, while approved organizations can request partner pricing and onboarding.",
    },
    {
      question: "Can families learn together?",
      answer:
        "Yes. Edunancial is designed for individuals, families and entrepreneurs.",
    },
    {
      question: "Do I receive certificates?",
      answer:
        "Members may receive Certificates of Completion for eligible modules. They are not academic degrees, licenses, or regulated credentials.",
    },
  ];

  return (
    <section className="bg-[#111827] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          FAQ
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Frequently Asked Questions
        </h2>

        <div className="mt-16 space-y-8">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl bg-slate-900 p-8"
            >
              <h3 className="text-2xl font-bold">
                {faq.question}
              </h3>

              <p className="mt-4 text-lg text-slate-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
