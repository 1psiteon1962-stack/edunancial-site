import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <section className="mb-20">
        <h1 className="mb-6 text-5xl font-bold leading-tight">
          Financial Literacy for the Real World
        </h1>

        <p className="mb-8 max-w-3xl text-xl text-gray-700">
          This platform exists to help people understand how money,
          business, and financial systems actually work — before they
          make decisions that cost them years.
        </p>

        <p className="mb-10 max-w-3xl text-gray-700">
          This is not advice. This is not hype.
          It’s structured financial literacy designed to give you clarity,
          positioning, and a path forward.
        </p>

        <Link
          href="/start"
          className="inline-block rounded bg-black px-8 py-4 text-white hover:bg-gray-800"
        >
          Start Here
        </Link>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Why This Exists</h2>
          <p className="text-gray-700">
            Most people work hard, earn income, and still feel stuck.
            That isn’t a motivation problem — it’s a systems problem.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">What You’ll Find Here</h2>
          <p className="text-gray-700">
            Clear explanations, structured tracks, and frameworks
            designed to help you move deliberately instead of blindly.
          </p>
        </div>
      </section>
    </main>
  );
}
