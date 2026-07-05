export default function BooksLibrary() {

  const books = [

    "Business Is About Making Profit",

    "Financial Competency",

    "Creative Real Estate Financing",

    "Commercial Credit",

    "Artificial Intelligence For Entrepreneurs",

    "Options",

    "Tax Liens & Tax Deeds",

    "Profit & KPIs",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          BOOK LIBRARY
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Learn Beyond The Classroom

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {books.map((book) => (

            <div
              key={book}
              className="rounded-xl bg-slate-900 p-8"
            >

              {book}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
