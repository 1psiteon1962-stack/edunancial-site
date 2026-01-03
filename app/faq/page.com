import Link from "next/link";

const faqs = [
  {
    q: "Is this “education”?",
    a: "This is financial literacy: practical understanding of how money systems work and how to make better decisions. It’s structured so you can follow a path instead of guessing.",
  },
  {
    q: "Are you giving legal, tax, or investment advice?",
    a: "No. This site provides educational information for general literacy purposes. It is not legal, tax, or financial advice. You should consult licensed professionals for your specific situation.",
  },
  {
    q: "Who is this for?",
    a: "People who want clarity and structure — beginners, intermediate learners, entrepreneurs, and anyone who wants a plan instead of random information.",
  },
  {
    q: "What should I start with?",
    a: "If you’re unsure, start with the Foundation Track. If you’re building income through a company, go Business. If you already have a base and want decision frameworks, go Investing.",
  },
  {
    q: "Do I need to be good at math?",
    a: "No. The focus is understanding concepts and making structured decisions. The goal is clarity, not complexity.",
  },
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">FAQs</h1>
      <p className="mt-4 text-lg text-gray-700">
        Simple answers — so people can move forward.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">{item.q}</h2>
            <p className="mt-2 text-gray-700">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/start"
          className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Start Here →
        </Link>
        <Link
          href="/tracks"
          className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
        >
          View Tracks
        </Link>
      </div>
    </main>
  );
}
