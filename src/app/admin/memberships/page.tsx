import {
  listMembershipSubscriptions,
  listProvisionedMembers,
} from "@/lib/payments/membershipLifecycle";
import { membershipPlans } from "@/types/membership";

export default function MembershipAdministrationPage() {
  const subscriptions = listMembershipSubscriptions();
  const members = listProvisionedMembers();

  const planSummaries = membershipPlans.map((plan) => {
    const activeCount = subscriptions.filter(
      (s) => s.planId === plan.id && s.status === "active"
    ).length;
    return {
      id: plan.id,
      name: plan.name,
      price:
        plan.monthlyPrice > 0
          ? `$${plan.monthlyPrice.toFixed(2)} / month`
          : "$0 / month",
      activeMembers: activeCount,
    };
  });

  const totalActive = members.filter((m) => m.active).length;
  const totalSubscriptions = subscriptions.length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <h1 className="text-6xl font-black">Membership Administration</h1>

      <p className="mt-6 max-w-4xl text-lg text-slate-300">
        Beta Tester access is managed separately through the invitation-only
        beta workflow and is intentionally hidden from public pricing.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <p className="text-slate-400 text-sm">Active Members</p>
          <p className="text-4xl font-black mt-2">{totalActive}</p>
        </div>
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <p className="text-slate-400 text-sm">Total Subscriptions</p>
          <p className="text-4xl font-black mt-2">{totalSubscriptions}</p>
        </div>
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <p className="text-slate-400 text-sm">Past-Due</p>
          <p className="text-4xl font-black mt-2">
            {subscriptions.filter((s) => s.status === "past-due").length}
          </p>
        </div>
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
          <p className="text-slate-400 text-sm">Cancelled</p>
          <p className="text-4xl font-black mt-2">
            {subscriptions.filter((s) => s.status === "cancelled").length}
          </p>
        </div>
      </div>

      <div className="grid gap-8 mt-12 lg:grid-cols-3">
        {planSummaries.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl bg-[#101a2f] border border-white/10 p-8"
          >
            <h2 className="text-3xl font-black">{plan.name}</h2>
            <p className="mt-5">Monthly Price: {plan.price}</p>
            <p>Active Members: {plan.activeMembers}</p>
          </div>
        ))}
      </div>

      {subscriptions.length > 0 && (
        <div className="mt-12 rounded-2xl bg-[#101a2f] border border-white/10 p-8">
          <h2 className="text-2xl font-black mb-6">Recent Subscriptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-slate-400 uppercase text-xs">
                <tr>
                  <th className="pb-3 pr-6">Email</th>
                  <th className="pb-3 pr-6">Plan</th>
                  <th className="pb-3 pr-6">Status</th>
                  <th className="pb-3 pr-6">Provider</th>
                  <th className="pb-3">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscriptions.slice(0, 20).map((sub) => (
                  <tr key={sub.id}>
                    <td className="py-3 pr-6">{sub.memberEmail}</td>
                    <td className="py-3 pr-6">{sub.planId}</td>
                    <td className="py-3 pr-6">
                      <span
                        className={
                          sub.status === "active"
                            ? "text-green-400"
                            : sub.status === "past-due"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6">{sub.provider}</td>
                    <td className="py-3">
                      {new Date(sub.currentPeriodStart).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
