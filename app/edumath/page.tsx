/* app/edumath/page.tsx */

export default function EduMathPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">
        EduMath™ – Financial Math Foundations
      </h1>

      <p className="mb-4">
        EduMath introduces the mathematical thinking required to
        understand money, business, investing, and risk.
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>Basic arithmetic for business decisions</li>
        <li>Percentages, margins, and break-even points</li>
        <li>Simple interest vs compound growth</li>
        <li>Why math errors destroy otherwise good ideas</li>
      </ul>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <strong>Status:</strong> Introductory content available.
        Advanced models unlock at higher levels.
      </div>
    </main>
  );
}
