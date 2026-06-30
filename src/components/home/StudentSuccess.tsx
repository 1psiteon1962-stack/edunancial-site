export default function StudentSuccess() {

  return (

    <section className="py-24 bg-[#08101f]">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">
          Student Success Stories
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {[1,2,3].map((item)=>(
            <div
              key={item}
              className="rounded-2xl bg-[#111827] p-8"
            >
              <h3 className="text-2xl font-bold">
                Student #{item}
              </h3>

              <p className="mt-4 text-gray-300">
                Future testimonial placeholder.
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>

  );

}
