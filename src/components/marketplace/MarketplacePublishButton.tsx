"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function csrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function MarketplacePublishButton({ productId, status }: { productId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const published = status === "PUBLISHED" || status === "READY";
  const nextStatus = published ? "DRAFT" : "PUBLISHED";

  async function updateStatus() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/marketplace/products/${encodeURIComponent(productId)}/status`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to update product status.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product status.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-1">
      <button type="button" disabled={busy} onClick={updateStatus} className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-black text-blue-100 disabled:opacity-50">
        {busy ? "Updating…" : published ? "Return to draft" : "Publish"}
      </button>
      {error ? <span className="max-w-48 text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
