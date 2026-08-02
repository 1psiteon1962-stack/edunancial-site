"use client";

import { useState } from "react";

import type { AdminManagedUser } from "@/lib/admin-content/user-storage";
import type { AdminRole } from "@/lib/admin-content/types";

interface Props {
  initialUsers: AdminManagedUser[];
  assignableRoles: AdminRole[];
  roleLabels: Record<AdminRole, string>;
  sessionRole: string;
}

const ROLE_BADGE: Record<string, string> = {
  owner: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  admin: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  editor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  instructor: "bg-green-500/20 text-green-300 border border-green-500/30",
  member: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  guest: "bg-slate-700/20 text-slate-400 border border-slate-700/30",
};

export default function AdminUsersClient({
  initialUsers,
  assignableRoles,
  roleLabels,
  sessionRole,
}: Props) {
  const [users, setUsers] = useState<AdminManagedUser[]>(initialUsers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>(assignableRoles[1] ?? assignableRoles[0]);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function getCsrfToken(): Promise<string> {
    const res = await fetch("/api/admin/auth/session");
    const data = await res.json().catch(() => ({})) as { csrfToken?: string };
    return data.csrfToken ?? "";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const csrf = await getCsrfToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify({ email, role, notes }),
      });
      const data = await res.json().catch(() => ({})) as { user?: AdminManagedUser; error?: string };
      if (!res.ok) {
        setFeedback({ type: "error", message: data.error ?? "Failed to add user." });
        return;
      }
      if (data.user) {
        setUsers((prev) => [...prev, data.user!]);
      }
      setEmail("");
      setNotes("");
      setFeedback({ type: "success", message: `User ${email} added with role "${role}".` });
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: AdminRole) {
    setBusy(true);
    setFeedback(null);
    try {
      const csrf = await getCsrfToken();
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json().catch(() => ({})) as { user?: AdminManagedUser; error?: string };
      if (!res.ok) {
        setFeedback({ type: "error", message: data.error ?? "Failed to update role." });
        return;
      }
      if (data.user) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? data.user! : u)));
      }
      setFeedback({ type: "success", message: "Role updated." });
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (!confirm(`Remove user record for ${userEmail}? This cannot be undone.`)) return;
    setBusy(true);
    setFeedback(null);
    try {
      const csrf = await getCsrfToken();
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrf },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setFeedback({ type: "error", message: data.error ?? "Failed to remove user." });
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFeedback({ type: "success", message: `Removed user record for ${userEmail}.` });
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 space-y-10">
      {/* Feedback */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-xl px-5 py-4 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-900/40 text-green-300"
              : "bg-red-900/40 text-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Add user form */}
      <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-8">
        <h2 className="text-xl font-bold">Add / Promote a User</h2>
        <p className="mt-1 text-sm text-slate-400">
          Assign an admin-managed role to a user by their email address.
        </p>

        <form onSubmit={handleAdd} className="mt-6 flex flex-wrap gap-4">
          <input
            type="email"
            required
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {assignableRoles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-yellow-400 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Add User"}
          </button>
        </form>
      </div>

      {/* Users table */}
      {users.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-12 text-center">
          <p className="text-xl font-bold text-white">No managed users yet</p>
          <p className="mt-2 text-slate-400">
            Use the form above to assign roles to users.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
          <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>Email</span>
            <span>Role</span>
            <span>Notes</span>
            <span>Actions</span>
          </div>
          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 items-center border-b border-white/5 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="font-medium text-white break-all">{u.email}</span>
              <span>
                <select
                  value={u.role}
                  disabled={busy || (u.role === "owner" && sessionRole !== "owner")}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border-0 bg-transparent focus:ring-2 focus:ring-yellow-500 ${ROLE_BADGE[u.role] ?? ""}`}
                >
                  {assignableRoles.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-white">
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
              </span>
              <span className="text-slate-400 text-xs truncate">{u.notes || "—"}</span>
              <div className="flex gap-3">
                {sessionRole === "owner" && (
                  <button
                    onClick={() => handleDelete(u.id, u.email)}
                    disabled={busy}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role reference */}
      <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-8">
        <h2 className="text-lg font-bold">Role Reference</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(roleLabels) as [AdminRole, string][]).map(([r, label]) => (
            <div key={r} className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_BADGE[r] ?? ""}`}>
                {r}
              </span>
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
