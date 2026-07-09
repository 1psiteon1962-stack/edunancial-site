"use client";

interface Props {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ questions, onSelect }: Props) {
  if (questions.length === 0) return null;

  return (
    <section aria-labelledby="suggested-questions-heading">
      <h2
        id="suggested-questions-heading"
        className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-400"
      >
        Suggested Questions
      </h2>

      <ul className="space-y-2">
        {questions.map((q) => (
          <li key={q}>
            <button
              onClick={() => onSelect(q)}
              className="w-full rounded-lg bg-slate-800/60 px-4 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label={`Ask: ${q}`}
            >
              <span aria-hidden="true" className="mr-2 text-yellow-400">→</span>
              {q}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
