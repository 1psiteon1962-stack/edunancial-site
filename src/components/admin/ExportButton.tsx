"use client";

import { useState } from "react";

export interface ExportButtonProps {
  onExport: () => Promise<string> | string;
  label?: string;
  filename?: string;
}

export default function ExportButton({
  onExport,
  label = "Export",
  filename = "export.csv",
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const csv = await onExport();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#101a2f] px-5 py-2.5 text-sm font-bold text-white transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span aria-hidden="true">⬇</span>
      {loading ? "Exporting…" : label}
    </button>
  );
}
