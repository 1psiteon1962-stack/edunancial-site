export default function HomepageTestimonials() {
  return (
    <section className="bg-[#111827] text-white py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[0.18em] text-center text-[#C49A28] font-bold">
          Why Edunancial
        </p>

        <h2 className="text-5xl md:text-6xl font-black text-center mt-6">
          Financial literacy based on
          experience, not theory.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          <div className="bg-[#151b2d] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-500">
              Practical
            </h3>

            <p className="mt-5 text-gray-300">
              Learn concepts that can be applied immediately.
            </p>
          </div>

          <div className="bg-[#151b2d] rounded-2xl p-8">
            <h3 className="text-2xl font-bold">
              Affordable
            </h3>

            <p className="mt-5 text-gray-300">
              Start learning for less than the cost of a cup of coffee.
            </p>
          </div>

          <div className="bg-[#151b2d] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-500">
              Global
            </h3>

            <p className="mt-5 text-gray-300">
              Designed for students anywhere in the world.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
