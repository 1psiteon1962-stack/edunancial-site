interface AssessmentProgressBarProps {
  currentSection: number;
  totalSections?: number;
}

export default function AssessmentProgressBar({
  currentSection,
  totalSections = 6,
}: AssessmentProgressBarProps) {
  const percent = Math.round((currentSection / totalSections) * 100);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
        <span>Section {currentSection} of {totalSections}</span>
        <span>{percent}% complete</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalSections }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < currentSection
                ? "bg-blue-600"
                : i === currentSection - 1
                ? "bg-blue-400"
                : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
