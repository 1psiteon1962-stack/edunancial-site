import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Frequently Asked Questions",
};

const faqs = [
  {
    question: "What is Edunancial?",
    answer: `${EDUNANCIAL_IDENTITY} It helps members improve practical financial judgment through learning resources, assessments, tools, and guided support.`,
  },
  {
    question: "What do Red, White, and Blue mean?",
    answer:
      "Red covers Real Estate, White covers Paper Assets, and Blue covers Business. These three pillars remain the foundation of the platform.",
  },
  {
    question: "How do memberships work?",
    answer:
      "Individual Membership is $19.99/month. Approved Organization Membership is $14.99/member/month for approved partners. The 100+ Member Organization Rate is $9.99 per active paid member/month with a minimum of 100 active paid members and a formal agreement.",
  },
  {
    question: "Is Edunancial a school or accredited institution?",
    answer: EDUNANCIAL_PUBLIC_DISCLAIMER,
  },
  {
    question: "Can I earn certificates?",
    answer:
      "Members may receive Certificates of Completion for Edunancial modules. These are completion recognitions only and are not academic degrees, licenses, or regulated credentials.",
  },
  {
    question: "How does Beta Tester access work?",
    answer:
      "Beta Tester access is $0, invitation only, tied to an approved email address, and begins at first successful login after valid redemption. Access expires 72 hours later unless an administrator explicitly extends it.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">FAQ</p>
        <h1 className="mt-6 text-6xl font-black">Frequently Asked Questions</h1>

        <div className="mt-20 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{faq.question}</h2>
              <p className="mt-4 leading-8 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
