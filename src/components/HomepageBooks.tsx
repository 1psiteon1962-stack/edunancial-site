import BookGrid from "./BookGrid";

export default function HomepageBooks() {

  return (

    <section className="bg-[#0a0f1e] text-white py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[0.18em] text-[#C49A28] font-bold">
          Digital Library
        </p>

        <h2 className="text-5xl md:text-6xl font-black mt-6">
          Start Reading Today
        </h2>

        <p className="text-xl text-gray-300 mt-8 max-w-3xl">
          Download books focused on business,
          investing, real estate and financial literacy.
        </p>

        <div className="mt-16">

          <BookGrid />

        </div>

      </div>

    </section>

  );

}
