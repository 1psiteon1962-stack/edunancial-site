import Link from "next/link";

export default function ContinueLearningBanner() {

  return (

    <section className="rounded-2xl bg-blue-700 p-10">

      <h2 className="text-4xl font-black">

        Welcome Back

      </h2>

      <p className="mt-6 text-xl">

        Continue building your Financial Competency.

      </p>

      <Link

        href="/learning-paths"

        className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-black"

      >

        Continue

      </Link>

    </section>

  );

}
