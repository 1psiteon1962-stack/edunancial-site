export const metadata = {
  title: "Certificates | Edunancial",
};

const certificates = [
  "Financial Foundations",
  "RED Real Estate",
  "WHITE Investing",
  "BLUE Business",
  "Financial Competency",
  "Entrepreneur",
  "Executive",
  "Economic Self Defense",
];

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          CERTIFICATES
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Earn Recognition
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {certificates.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-3xl font-black">
                {item}
              </h2>

              <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-bold">
                View Certificate
              </button>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
