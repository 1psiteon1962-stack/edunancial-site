import Link from "next/link";

export default function DownloadsPage() {

  return (

    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <div className="mx-auto max-w-5xl px-6 py-20">

        <h1 className="text-5xl font-black">

          My Downloads

        </h1>

        <p className="mt-6 text-gray-300 text-xl">

          Purchased ebooks, flashcard packs,
          worksheets, and library content will
          appear here.

        </p>

        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            href="/library/downloads"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500"
          >
            Library Downloads
          </Link>

          <Link
            href="/library"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold hover:border-blue-500"
          >
            Browse Library
          </Link>

        </div>

        <div className="mt-16 rounded-2xl bg-[#151b2d] p-8">

          <h2 className="text-2xl font-bold">

            Digital Library Downloads

          </h2>

          <p className="mt-4 text-gray-400">

            After completing a purchase or joining a membership,
            your purchased products and library items will be
            available here for download.

          </p>

        </div>

      </div>

    </main>

  );

}
