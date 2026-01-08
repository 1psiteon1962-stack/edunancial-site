import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">
        Structured Understanding for Complex Systems
      </h1>

      <p className="text-lg mb-8 text-gray-700">
        Edunancial provides structured information designed to help users
        understand financial and business systems across jurisdictions.
      </p>

      <Link
        href="/us"
        className="inline-block bg-black text-white px-6 py-3 rounded"
      >
        Enter United States
      </Link>
    </main>
  );
}
