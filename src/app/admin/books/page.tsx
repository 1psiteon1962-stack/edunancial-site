import BookUploadForm from "@/components/BookUploadForm";

export default function AdminBooksPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-20">

        <h1 className="text-6xl font-black">

          Book Administration

        </h1>

        <p className="mt-6 text-xl text-gray-300">

          Upload new books, cover images,
          PDFs, prices, Square checkout links,
          and publish instantly.

        </p>

        <div className="mt-16">

          <BookUploadForm />

        </div>

      </section>

    </main>

  );

}
