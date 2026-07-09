"use client";

import { useEffect, useState } from "react";

import {
  createProtectedJsonHeaders,
  getBrowserConsentPreferences,
} from "@/lib/security/client";

type ConsentMode = "accept-all" | "essential-only";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preferences = getBrowserConsentPreferences();

    if (preferences.updatedAt) {
      return;
    }

    setVisible(true);
  }, []);

  async function savePreferences(mode: ConsentMode) {
    try {
      setLoading(true);

      const response = await fetch("/api/privacy/consent", {
        method: "POST",
        headers: createProtectedJsonHeaders(),
        credentials: "same-origin",
        body: JSON.stringify({
          analytics: mode === "accept-all",
          marketing: mode === "accept-all",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to persist consent preferences.");
      }

      setVisible(false);
    } catch (error) {
      console.warn("Cookie consent update failed:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] border-t border-white/10 bg-[#0b1730]/95 px-6 py-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Privacy controls</p>
          <p className="mt-1 max-w-3xl text-sm text-slate-300">
            Edunancial uses essential cookies to protect sessions and optional analytics
            cookies only with your consent.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            onClick={() => savePreferences("essential-only")}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-60"
          >
            Essential only
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => savePreferences("accept-all")}
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-60"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
