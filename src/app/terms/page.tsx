export default function TermsPage() {

  return (

    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-black mb-4">

          Financial Terms

        </h1>

        <p className="text-xl text-gray-300 mb-12">

          Learn the language of wealth through the Red, White, Blue framework.

        </p>

        <div className="grid gap-8">

          <div className="rounded-xl bg-[#141826] p-8 border border-blue-700">

            <h2 className="text-3xl font-bold">

              Business Foundations

            </h2>

            <p className="mt-3">

              FREE • 50 Terms

            </p>

            <button className="mt-6 bg-blue-600 px-6 py-3 rounded-lg font-bold">

              Study Free

            </button>

          </div>

          <div className="rounded-xl bg-[#141826] p-8">

            <h2 className="text-3xl font-bold text-red-500">

              Real Estate Basics

            </h2>

            <p className="mt-3">

              $0.99 • 50 Terms

            </p>

          </div>

          <div className="rounded-xl bg-[#141826] p-8">

            <h2 className="text-3xl font-bold">

              Paper Assets Basics

            </h2>

            <p className="mt-3">

              $0.99 • 50 Terms

            </p>

          </div>

          <div className="rounded-xl bg-[#141826] p-8">

            <h2 className="text-3xl font-bold text-blue-500">

              Sales & Marketing

            </h2>

            <p className="mt-3">

              $0.99 • 50 Terms

            </p>

          </div>

        </div>

      </div>

    </main>

  );

}
