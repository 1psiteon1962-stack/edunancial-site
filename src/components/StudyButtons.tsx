"use client";

interface Props {
  onKnow(): void;
  onAgain(): void;
}

export default function StudyButtons({
  onKnow,
  onAgain,
}: Props) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">

      <button
        onClick={onAgain}
        className="rounded-xl bg-red-600 py-4 text-xl font-bold text-white"
      >
        Still Learning
      </button>

      <button
        onClick={onKnow}
        className="rounded-xl bg-green-600 py-4 text-xl font-bold text-white"
      >
        Got It
      </button>

    </div>
  );
}
