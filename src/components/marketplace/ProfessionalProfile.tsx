export default function ProfessionalProfile() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="max-w-5xl mx-auto px-6 py-16">

        <div className="rounded-xl bg-slate-900 border border-slate-700 p-10">

          <h1 className="text-4xl font-black">

            Professional Name

          </h1>

          <p className="mt-3 text-gray-400">

            Verified Professional

          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-10">

            <div>

              <h2 className="text-2xl font-bold">
                About
              </h2>

              <p className="mt-4 text-gray-300">
                Biography, credentials, specialties, experience and services.
              </p>

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Contact
              </h2>

              <p className="mt-4 text-gray-300">
                Phone, email, website, office locations and appointment requests.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}
