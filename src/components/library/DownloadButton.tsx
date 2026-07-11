"use client";

import { useState } from "react";
import type { LibraryItem } from "@/lib/library/libraryTypes";

interface DownloadButtonProps {
  item: LibraryItem;
  userId?: string;
}

export default function DownloadButton({ item, userId = "demo" }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!item.downloadable) return null;

  async function handleDownload() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/library/downloads?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Download failed. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");

      // If a real download URL is provided, trigger the browser download
      if (data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = item.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-400 font-semibold">
        <span aria-hidden="true">✓</span>
        <span>Download recorded!</span>
        {!item.downloadUrl && (
          <span className="text-slate-400 text-sm">(File will be available soon)</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={status === "loading"}
        className="rounded-lg bg-green-600 px-6 py-3 font-bold hover:bg-green-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center gap-2"
        aria-label={`Download ${item.title} as ${item.fileFormat?.toUpperCase()}`}
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin" aria-hidden="true">⟳</span>
            Preparing…
          </>
        ) : (
          <>
            <span aria-hidden="true">↓</span>
            Download {item.fileFormat?.toUpperCase()}
          </>
        )}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
