"use client";

import { FinancialTerm, COLORS } from "@/lib/termTypes";

interface Props {
  term: FinancialTerm;
}

export default function FinancialTermCard({
  term,
}: Props) {

  return (

    <div
      className="rounded-2xl bg-[#151b2d] p-8 shadow-lg"
      style={{
        borderLeft: `6px solid ${COLORS[term.category]}`,
      }}
    >

      <h2 className="text-3xl font-black">

        {term.term}

      </h2>

      <p className="mt-6 text-lg text-gray-300">

        {term.definition}

      </p>

      <div className="mt-8">

        <span
          className="rounded-full px-4 py-2 text-sm font-bold"
          style={{
            backgroundColor: COLORS[term.category],
            color: term.category === "white" ? "#000" : "#fff",
          }}
        >

          {term.category.toUpperCase()}

        </span>

      </div>

    </div>

  );

}
