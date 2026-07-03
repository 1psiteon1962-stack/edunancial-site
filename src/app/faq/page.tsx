export const metadata = {
  title: "Frequently Asked Questions",
};

const faqs = [
  "What is Financial Competency?",
  "How do memberships work?",
  "Are books available in Spanish?",
  "Can I earn certificates?",
  "How does the Competency Passport work?",
  "Can children use Edunancial?",
  "Will there be audiobooks?",
  "How do I contact support?",
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          FAQ
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Frequently Asked Questions
        </h1>

        <div className="mt-20 space-y-6">

          {faqs.map((faq) => (

            <div
              key={faq}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">
                {faq}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
