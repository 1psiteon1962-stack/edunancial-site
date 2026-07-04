export default function AICoachCard() {
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        AI Financial Coach
      </h2>

      <p className="mt-4 text-slate-700">
        Your AI Coach will recommend courses,
        identify strengths and weaknesses,
        monitor your financial competency,
        and provide personalized learning
        recommendations.
      </p>

      <div className="mt-8 rounded-xl bg-white p-6">

        <p className="font-semibold">
          Status
        </p>

        <p className="mt-2 text-slate-600">
          Coming Soon
        </p>

      </div>

      <button
        className="mt-10 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
      >
        Open AI Coach
      </button>

    </section>
  );
}
