import Link from "next/link";

export default function HomepageFinalCTA() {

  return (

    <section className="bg-[#0b1020] text-white py-28 px-6">

      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-5xl md:text-7xl font-black">

          Would You Like
          <br />
          To Work With
          <br />
          Your Head?

        </h2>

        <p className="text-xl text-gray-300 mt-10">

          The same question that started this journey
          can start yours today.

        </p>

        <Link
          href="/books"
          className="inline-block mt-12 rounded-xl bg-red-600 px-10 py-4 font-bold hover:bg-red-700"
        >

          Start Learning

        </Link>

      </div>

    </section>

  );

}
