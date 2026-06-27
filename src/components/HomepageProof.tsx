export default function HomepageProof() {
  return (
    <section className="bg-[#111827] text-white py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <p className="text-center uppercase tracking-[0.18em] text-[#C49A28] font-bold">
          Proof of Concept
        </p>

        <h2 className="text-5xl md:text-7xl font-black text-center mt-6">
          Two Students.
          <br />
          Two Continents.
          <br />
          One Lesson.
        </h2>

        <div className="grid md:grid-cols-2 gap-10 mt-20">

          <div className="rounded-2xl bg-[#151b2d] p-10 border border-red-600">

            <h3 className="text-3xl font-black text-red-500">
              America
            </h3>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              A young student learning ownership, delayed gratification,
              investing, entrepreneurship and discipline.
            </p>

          </div>

          <div className="rounded-2xl bg-[#151b2d] p-10 border border-blue-600">

            <h3 className="text-3xl font-black text-blue-500">
              Uganda
            </h3>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              The same financial principles applied in an entirely different
              economy with the same long-term objective—economic freedom.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
