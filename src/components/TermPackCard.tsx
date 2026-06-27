"use client";

import Link from "next/link";
import { TermPack, COLORS } from "@/lib/termTypes";

interface Props {
  pack: TermPack;
}

export default function TermPackCard({ pack }: Props) {
  return (
    <div
      className="rounded-2xl bg-[#151b2d] p-8 shadow-lg"
      style={{
        border: `2px solid ${COLORS[pack.color]}`,
      }}
    >
      <div className="text-5xl">
        {pack.icon}
      </div>

      <h2 className="mt-6 text-3xl font-black">
        {pack.title}
      </h2>

      <p className="mt-4 text-gray-300">
        {pack.description}
      </p>

      <div className="mt-8 flex items-center justify-between">

        <span className="text-3xl font-black">
          {pack.free ? "FREE" : `$${pack.price.toFixed(2)}`}
        </span>

        <Link
          href={`/terms/${pack.id}`}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
        >
          {pack.free ? "Study" : "Unlock"}
        </Link>

      </div>
    </div>
  );
}
