"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ROLE_CONFIGS, ALL_RESOURCES, ALL_ACTIONS } from "@/lib/admin/permissions";
import type { AdminRole, Permission, RoleConfig } from "@/lib/admin/types";

const MEMBER_COUNTS: Record<AdminRole, number> = {
  super_admin: 3,
  admin: 8,
  content_manager: 12,
  instructor: 34,
  support: 15,
  marketing: 9,
  analyst: 6,
};

function hasPerm(permissions: Permission[], action: Permission["action"], resource: string): boolean {
  return permissions.some((p) => p.action === action && p.resource === resource);
}

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<RoleConfig[]>(ROLE_CONFIGS);
  const [expanded, setExpanded] = useState<AdminRole | null>(null);
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);
  const [draftPermissions, setDraftPermissions] = useState<Permission[]>([]);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  function openEdit(role: RoleConfig) {
    setEditingRole(role);
    setDraftPermissions(role.permissions);
  }

  function togglePermission(action: Permission["action"], resource: string) {
    setDraftPermissions((prev) => {
      const exists = hasPerm(prev, action, resource);
      if (exists) {
        return prev.filter((p) => !(p.action === action && p.resource === resource));
      }
      return [...prev, { action, resource }];
    });
  }

  function saveEdits() {
    if (!editingRole) return;
    setRoles((prev) =>
      prev.map((r) => (r.role === editingRole.role ? { ...r, permissions: draftPermissions } : r))
    );
    setEditingRole(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Role Management & Permissions"
        description="Configure what each administrative role can view, create, edit, delete, export, and manage."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {roles.map((role) => {
          const isExpanded = expanded === role.role;
          const isSuperAdmin = role.role === "super_admin";
          return (
            <div
              key={role.role}
              className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-sm font-black ${role.color}`}
                  >
                    {role.label}
                  </span>
                  <p className="mt-3 text-sm text-gray-400">{role.description}</p>
                  <p className="mt-2 text-xs font-bold text-gray-500">
                    {MEMBER_COUNTS[role.role]} members with this role
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpanded(isExpanded ? null : role.role)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-white/5"
                >
                  {isExpanded ? "Hide Permissions" : "Show Permissions"}
                </button>
                {!isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => openEdit(role)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
                  >
                    Edit Permissions
                  </button>
                )}
                {isSuperAdmin && (
                  <span className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-500">
                    Read-only (Super Admin)
                  </span>
                )}
              </div>

              {isExpanded && (
                <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[480px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2 font-bold">Resource</th>
                        {ALL_ACTIONS.map((action) => (
                          <th key={action} className="px-3 py-2 text-center font-bold capitalize">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_RESOURCES.map((resource) => (
                        <tr key={resource} className="border-b border-white/5 last:border-0">
                          <td className="px-3 py-2 font-semibold capitalize text-gray-200">{resource}</td>
                          {ALL_ACTIONS.map((action) => (
                            <td key={action} className="px-3 py-2 text-center">
                              {hasPerm(role.permissions, action, resource) ? (
                                <span className="text-green-400" aria-label="Allowed">✓</span>
                              ) : (
                                <span className="text-gray-600" aria-label="Not allowed">–</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingRole && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditingRole(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-permissions-title"
            className="relative z-10 h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0b1526] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="edit-permissions-title" className="text-xl font-black text-white">
                Edit Permissions — {editingRole.label}
              </h2>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                aria-label="Close edit permissions panel"
                className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-sm text-yellow-400">
              ⚠ Changes take effect immediately for all users with this role.
            </p>

            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2 font-bold">Resource</th>
                    {ALL_ACTIONS.map((action) => (
                      <th key={action} className="px-3 py-2 text-center font-bold capitalize">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_RESOURCES.map((resource) => (
                    <tr key={resource} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2 font-semibold capitalize text-gray-200">{resource}</td>
                      {ALL_ACTIONS.map((action) => {
                        const id = `perm-${resource}-${action}`;
                        return (
                          <td key={action} className="px-3 py-2 text-center">
                            <label htmlFor={id} className="sr-only">
                              {action} {resource}
                            </label>
                            <input
                              id={id}
                              type="checkbox"
                              checked={hasPerm(draftPermissions, action, resource)}
                              onChange={() => togglePermission(action, resource)}
                              className="h-4 w-4 rounded border-white/20 bg-[#08101f]"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSaveConfirmOpen(true)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={saveEdits}
        title="Save permission changes?"
        message="Changes take effect immediately for all users with this role."
        confirmLabel="Save Changes"
        confirmVariant="primary"
      />
    </div>
  );
}
