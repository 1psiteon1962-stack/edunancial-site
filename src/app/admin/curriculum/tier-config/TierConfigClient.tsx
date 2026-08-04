"use client";

import { useState } from "react";
import Link from "next/link";

interface TierRow {
  tier: "basic" | "pro" | "gold";
  label: string;
  levels: number[];
}

interface Props {
  initialRows: TierRow[];
  freePreviewMaxLesson: number;
  updatedAt: string;
  updatedBy: string;
  csrfToken: string;
}

const ALL_LEVELS = [1, 2, 3, 4, 5];
const TIER_LABELS: Record<string, string> = {
  basic: "Basic Membership",
  pro: "Pro Membership",
  gold: "Gold Membership",
};

export default function TierConfigClient({
  initialRows,
  freePreviewMaxLesson,
  updatedAt,
  updatedBy,
  csrfToken,
}: Props) {
  const [rows, setRows] = useState<TierRow[]>(initialRows);
  const [freePreviewMax, setFreePreviewMax] = useState(freePreviewMaxLesson);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function toggleLevel(tier: TierRow["tier"], level: number) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.tier !== tier) return row;
        const has = row.levels.includes(level);
        const next = has ? row.levels.filter((l) => l !== level) : [...row.levels, level].sort((a, b) => a - b);
        return { ...row, levels: next };
      }),
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const mapping: Record<string, number[]> = {};
      for (const row of rows) mapping[row.tier] = row.levels;

      const res = await fetch("/api/admin/curriculum/tier-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          mapping,
          freePreview: { level: 1, maxLesson: freePreviewMax },
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setMessage({ type: "ok", text: "Tier configuration saved. Changes take effect immediately." });
      } else {
        setMessage({ type: "err", text: data.error ?? "Save failed." });
      }
    } catch (err) {
      setMessage({ type: "err", text: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link href="/admin/curriculum" className="text-sm text-yellow-400 hover:text-yellow-300">
          ← Back to Curriculum Dashboard
        </Link>
      </div>

      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-1">Admin Settings</p>
        <h1 className="text-4xl font-black">Tier → Level Configuration</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Configure which curriculum levels each membership tier unlocks. Changes take effect
          immediately without a deploy. This mapping applies to all tracks (RED, WHITE, BLUE, and
          future tracks) equally.
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Last updated: {new Date(updatedAt).toLocaleString()} by {updatedBy}
        </p>
      </div>

      {/* Free preview */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
        <h2 className="font-black text-blue-300 mb-2">Free Preview</h2>
        <p className="text-sm text-slate-400 mb-4">
          Level 1 lessons up to and including this lesson number are freely accessible to any
          authenticated visitor with no membership. This applies to all tracks.
        </p>
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-300 font-semibold">
            Level 1, lessons 001 through{" "}
            <input
              type="number"
              min={1}
              max={10}
              value={freePreviewMax}
              onChange={(e) => setFreePreviewMax(Number(e.target.value))}
              className="w-16 rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-center text-white font-black mx-1"
            />
            {" "}are free preview
          </label>
        </div>
      </div>

      {/* Tier mapping */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="font-black text-white">Membership Tier Access</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Check the levels each tier should unlock. Tiers are cumulative — each tier should include
            all levels from lower tiers.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="px-6 py-3 text-left text-slate-400 font-semibold">Tier</th>
              {ALL_LEVELS.map((lvl) => (
                <th key={lvl} className="px-4 py-3 text-center text-slate-400 font-semibold w-20">
                  Level {lvl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((row) => (
              <tr key={row.tier} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4">
                  <span className="font-black text-white">{TIER_LABELS[row.tier]}</span>
                  <br />
                  <span className="text-xs text-slate-500 font-mono">{row.tier}</span>
                </td>
                {ALL_LEVELS.map((lvl) => (
                  <td key={lvl} className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={row.levels.includes(lvl)}
                      onChange={() => toggleLevel(row.tier, lvl)}
                      className="w-5 h-5 rounded accent-yellow-400 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 text-sm text-slate-400">
        <strong className="text-white">Note:</strong> The locked-lesson page shown to members
        who don&apos;t have access will automatically state the correct required tier based on
        this configuration.
      </div>

      {/* Save */}
      {message && (
        <div
          className={`rounded-xl p-4 text-sm font-semibold ${
            message.type === "ok"
              ? "bg-green-500/10 border border-green-500/30 text-green-300"
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-yellow-500 px-8 py-3 font-black text-black hover:bg-yellow-400 disabled:opacity-50 transition"
      >
        {saving ? "Saving…" : "Save Configuration"}
      </button>
    </div>
  );
}
