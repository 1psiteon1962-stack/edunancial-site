export default function FAQPreview() {

  const faqs = [
    "How do I begin?",
    "Are certificates included?",
    "Can I study on mobile?",
    "How often are courses updated?",
    "Can I download resources?",
    "Will more countries be added?"
  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">
          Frequently Asked Questions
        </h2>

        <div className="mt-12 space-y-6">

          {faqs.map((faq)=>(
            <div
              key={faq}
              className="rounded-xl bg-[#111827] p-6"
            >
              <h3 className="text-2xl font-bold">
                {faq}
              </h3>
            </div>
          ))}

        </div>

      </div>

    </section>

  );

}
