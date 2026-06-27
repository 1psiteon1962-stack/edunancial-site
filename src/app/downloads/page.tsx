import DownloadCard from "@/components/DownloadCard";
import { downloads } from "@/lib/downloads";

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-black">
          My Downloads
        </h1>

        <p className="text-gray-300 mt-5">
          All purchased products appear here.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {downloads.map((book) => (

            <DownloadCard
              key={book.id}
              title={book.title}
              filename={book.filename}
            />

          ))}

        </div>

      </section>

    </main>
  );
}
