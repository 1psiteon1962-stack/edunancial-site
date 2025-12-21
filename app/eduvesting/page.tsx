/* app/eduvesting/page.tsx */

export default function EduVestingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">
        EduVesting™ – Learning How Capital Actually Works
      </h1>

      <p className="mb-4">
        EduVesting explains investing from first principles —
        ownership, risk, time, and discipline.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>What investing really means (and what it doesn’t)</li>
        <li>Stocks, businesses, and ownership logic</li>
        <li>Why most people lose money</li>
        <li>Long-term thinking vs speculation</li>
      </ul>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <strong>Status:</strong> Educational overview live.
        Strategy tools added in later phases.
      </div>
    </main>
  );
}
