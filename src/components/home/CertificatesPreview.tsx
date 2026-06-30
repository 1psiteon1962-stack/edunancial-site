export default function CertificatesPreview() {

  return (

    <section className="py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">
          Certificates
        </h2>

        <p className="mt-6 text-xl text-gray-300">
          Complete courses and earn digital certificates.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {["RED","WHITE","BLUE"].map((item)=>(

            <div
              key={item}
              className="rounded-2xl bg-[#111827] p-8"
            >

              <h3 className="text-3xl font-bold">
                {item}
              </h3>

              <p className="mt-4 text-gray-400">
                Certificate Preview
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
