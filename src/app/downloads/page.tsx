export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-black">
          My Downloads
        </h1>

        <p className="mt-4 text-xl text-gray-300">
          Purchased books, guides and future courses will appear here.
        </p>

        <div className="mt-12 bg-[#151b2d] rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            Business Is About Profit
          </h2>

          <p className="mt-3 text-gray-400">
            Purchase required.
          </p>

          <button
            disabled
            className="mt-8 px-6 py-3 rounded-xl bg-gray-700 text-gray-400 cursor-not-allowed"
          >
            Download Locked
          </button>

        </div>

      </section>

    </main>
  );
}
