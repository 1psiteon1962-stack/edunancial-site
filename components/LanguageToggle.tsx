"use client";

type Language = "en" | "es";

type LanguageToggleProps = {
  value: Language;
  onChange: (lang: Language) => void;
};

export default function LanguageToggle({
  value,
  onChange,
}: LanguageToggleProps) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button
        type="button"
        onClick={() => onChange("en")}
        disabled={value === "en"}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onChange("es")}
        disabled={value === "es"}
      >
        ES
      </button>
    </div>
  );
}
