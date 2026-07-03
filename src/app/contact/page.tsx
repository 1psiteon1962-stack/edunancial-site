export const metadata = {
  title: "Contact Edunancial",
};

const departments = [
  {
    name: "General Information",
    email: "info@edunancial.com",
  },
  {
    name: "Customer Support",
    email: "support@edunancial.com",
  },
  {
    name: "Courses",
    email: "courses@edunancial.com",
  },
  {
    name: "Books & eBooks",
    email: "books@edunancial.com",
  },
  {
    name: "Certificates",
    email: "certificates@edunancial.com",
  },
  {
    name: "Billing",
    email: "billing@edunancial.com",
  },
  {
    name: "Partnerships",
    email: "partnerships@edunancial.com",
  },
  {
    name: "Media",
    email: "media@edunancial.com",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          CONTACT EDUNANCIAL
        </p>

        <h1 className="mt-6 text-6xl font-black">
          We're Here To Help
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {departments.map((dept) => (

            <div
              key={dept.email}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">
                {dept.name}
              </h2>

              <p className="mt-4 text-blue-400">
                {dept.email}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
