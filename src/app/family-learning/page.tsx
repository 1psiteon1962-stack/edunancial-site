export const metadata = {
  title: "Family Learning | Edunancial",
};

const sections = [
  "Parents",
  "Children",
  "Teenagers",
  "Family Budget",
  "Family Investing",
  "Family Business",
  "Family Goals",
  "Family Challenges",
];

export default function FamilyLearningPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          FAMILY LEARNING
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Build Wealth Together
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {sections.map((section) => (

            <div
              key={section}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">

                {section}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
