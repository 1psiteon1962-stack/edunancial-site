"use client";

type Color = "all" | "red" | "white" | "blue";

interface Props {
  value: Color;
  onChange: (value: Color) => void;
}

export default function TermFilter({
  value,
  onChange,
}: Props) {
  const filters: Color[] = [
    "all",
    "red",
    "white",
    "blue",
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-full px-6 py-3 font-bold ${
            value === filter
              ? "bg-blue-600 text-white"
              : "bg-[#151b2d] text-gray-300"
          }`}
        >
          {filter.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
