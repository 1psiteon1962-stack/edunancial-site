"use client";

import { useState } from "react";
import FlashCard from "@/components/FlashCard";
import StudyButtons from "@/components/StudyButtons";
import ProgressBar from "@/components/ProgressBar";
import { financialTerms } from "@/lib/financialTerms";
import { nextCard } from "@/lib/studyEngine";

export default function StudyPage() {

  const cards = financialTerms.filter(t => t.free);

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(0);

  function markComplete() {
    setCompleted(c => c + 1);
    setIndex(i => nextCard(cards, i));
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      <h1 className="text-5xl font-black mb-8">
        Study Mode
      </h1>

      <ProgressBar
        current={completed}
        total={cards.length}
      />

      <div className="mt-10">
        <FlashCard term={cards[index]} />
      </div>

      <StudyButtons
        onKnow={markComplete}
        onAgain={() => setIndex(i => nextCard(cards, i))}
      />

    </main>
  );
}
