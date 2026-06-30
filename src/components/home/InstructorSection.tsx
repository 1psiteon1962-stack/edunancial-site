import Link from "next/link";

export default function InstructorSection() {
  return (
    <section className="bg-[#111827] py-24">
      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-center text-5xl font-black">
          Meet Your Instructor
        </h2>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xl text-gray-300 leading-relaxed">
          Learn practical financial literacy from real-world experience.
          No hype. No gimmicks. Just education designed to help ordinary
          people build wealth through Real Estate, Paper Assets and Business.
        </p>

        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
}
