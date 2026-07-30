import { requireRolePageSession } from "@/lib/admin-content/auth";
import { listAdminUsers } from "@/lib/admin-content/user-storage";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/rbac/permissions";
import type { AdminRole } from "@/lib/admin-content/types";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const metadata = { title: "User Management | Edunancial Admin" };

export default async function AdminUsersPage() {
  const session = await requireRolePageSession(["owner", "admin"]);
  const users = await listAdminUsers();

  const canAssignOwner = session.role === "owner";

  // Roles that this session is permitted to assign
  const assignableRoles: AdminRole[] = canAssignOwner
    ? (ALL_ROLES as AdminRole[])
    : (ALL_ROLES.filter((r) => r !== "owner") as AdminRole[]);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">Admin</p>
            <h1 className="mt-2 text-4xl font-black">User &amp; Role Management</h1>
            <p className="mt-2 text-slate-400">
              {users.length} managed user record{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <AdminUsersClient
          initialUsers={users}
          assignableRoles={assignableRoles}
          roleLabels={ROLE_LABELS}
          sessionRole={session.role ?? "admin"}
        />
      </section>
    </main>
  );
}
