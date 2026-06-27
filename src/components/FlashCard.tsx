"use client";

import { useState } from "react";
import { FinancialTerm, COLORS } from "@/lib/termTypes";

interface Props {
  term: FinancialTerm;
}

export default function FlashCard({ term }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer rounded-2xl border p-8 bg-[#151b2d] transition-all duration-300"
      style={{
        borderColor: COLORS[term.category],
        minHeight: "320px",
      }}
    >
      {!flipped ? (
        <>
          <p
            className="font-bold uppercase tracking-widest"
            style={{ color: COLORS[term.category] }}
          >
            {term.category.toUpperCase()}
          </p>

          <h2 className="mt-10 text-4xl font-black">
            {term.term}
          </h2>

          <p className="mt-16 text-center text-gray-400">
            Tap to reveal definition
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-black">
            {term.term}
          </h2>

          <p className="mt-8 text-lg text-gray-300">
            {term.definition}
          </p>

          <p className="mt-12 text-center text-gray-500">
            Tap to return
          </p>
        </>
      )}
    </div>
  );
}
