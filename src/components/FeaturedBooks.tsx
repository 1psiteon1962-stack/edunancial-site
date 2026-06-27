import { getFeaturedBooks } from "@/lib/bookManager";
import EbookCard from "./EbookCard";

export default function FeaturedBooks() {

  const books = getFeaturedBooks();

  return (

    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-5xl font-black">

        Featured Books

      </h2>

      <p className="mt-6 text-xl text-gray-300">

        Start your financial education with
        our most popular titles.

      </p>

      <div className="grid lg:grid-cols-3 gap-10 mt-16">

        {books.map(book => (

          <EbookCard
            key={book.id}
            book={book}
          />

        ))}

      </div>

    </section>

  );

}
