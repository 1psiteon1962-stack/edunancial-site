/* app/readiness/page.tsx */

export default function ReadinessPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Financial Readiness Assessment
      </h1>

      <p className="mb-4">
        Before strategy comes readiness.
        This section helps users understand where they actually stand.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>Income stability</li>
        <li>Expense control</li>
        <li>Debt awareness</li>
        <li>Decision-making discipline</li>
      </ul>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <strong>Note:</strong> Interactive scoring and personalization
        will be added after launch.
      </div>
    </main>
  );
}
