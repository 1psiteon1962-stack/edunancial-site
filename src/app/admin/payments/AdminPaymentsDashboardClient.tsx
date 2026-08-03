"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  memberId: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  referenceNumber: string;
}

interface Subscription {
  id: string;
  memberEmail: string;
  planId: string;
  status: string;
  provider: string;
  currentPeriodStart: string;
  currentPeriodEnd?: string;
  updatedAt: string;
}

interface Member {
  id: string;
  email: string;
  membershipTier: string;
  active: boolean;
  hasDashboardAccess: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WebhookEvent {
  eventId: string;
  eventType: string;
  processedAt: string;
}

type ActiveTab =
  | "overview"
  | "transactions"
  | "subscriptions"
  | "members"
  | "webhook-events"
  | "refund";

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active" || status === "completed" || status === "reactivated"
      ? "text-green-400"
      : status === "past-due" || status === "pending" || status === "processing"
      ? "text-yellow-400"
      : status === "cancelled" || status === "failed" || status === "expired"
      ? "text-red-400"
      : "text-slate-400";
  return <span className={color}>{status}</span>;
}

export default function AdminPaymentsDashboardClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Refund form state
  const [refundPaymentId, setRefundPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundResult, setRefundResult] = useState<string | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [txRes, subRes, memRes, evtRes] = await Promise.all([
        fetch("/api/admin/payments/transactions").then((r) => r.json()),
        fetch("/api/admin/payments/subscriptions").then((r) => r.json()),
        fetch("/api/admin/payments/members").then((r) => r.json()),
        fetch("/api/admin/payments/webhook-events").then((r) => r.json()),
      ]);

      setTransactions(
        (txRes as { transactions?: Transaction[] }).transactions ?? []
      );
      setSubscriptions(
        (subRes as { subscriptions?: Subscription[] }).subscriptions ?? []
      );
      setMembers((memRes as { members?: Member[] }).members ?? []);
      setWebhookEvents(
        (evtRes as { events?: WebhookEvent[] }).events ?? []
      );
    } catch {
      // Data may be empty in dev; silently continue.
    } finally {
      setLoading(false);
    }
  }

  async function handleRefund(e: React.FormEvent) {
    e.preventDefault();
    setRefundLoading(true);
    setRefundResult(null);
    try {
      const res = await fetch("/api/admin/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: refundPaymentId,
          amount: parseFloat(refundAmount),
          reason: refundReason,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        refundId?: string;
        error?: string;
      };
      if (data.success) {
        setRefundResult(`✅ Refund issued. Refund ID: ${data.refundId}`);
        setRefundPaymentId("");
        setRefundAmount("");
        setRefundReason("");
      } else {
        setRefundResult(`❌ ${data.error ?? "Refund failed"}`);
      }
    } catch {
      setRefundResult("❌ Network error. Please try again.");
    } finally {
      setRefundLoading(false);
    }
  }

  const activeMembers = members.filter((m) => m.active).length;
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;
  const pastDue = subscriptions.filter((s) => s.status === "past-due").length;
  const failedTx = transactions.filter((t) => t.status === "failed").length;

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "members", label: "Members" },
    { id: "webhook-events", label: "Webhook Events" },
    { id: "refund", label: "Issue Refund" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-5xl font-black">Payment Administration</h1>
        <Link
          href="/admin/memberships"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Membership Admin →
        </Link>
      </div>
      <p className="text-slate-400 mb-8 text-sm">
        Unified view of all Square transactions, subscriptions, members, webhook
        events, and refund operations.
      </p>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Active Members", value: activeMembers, color: "text-green-400" },
          {
            label: "Active Subscriptions",
            value: activeSubscriptions,
            color: "text-blue-400",
          },
          {
            label: "Past-Due",
            value: pastDue,
            color: pastDue > 0 ? "text-yellow-400" : "text-slate-400",
          },
          {
            label: "Failed Transactions",
            value: failedTx,
            color: failedTx > 0 ? "text-red-400" : "text-slate-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl bg-[#101a2f] border border-white/10 p-6"
          >
            <p className="text-slate-400 text-sm">{label}</p>
            <p className={`text-4xl font-black mt-2 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-blue-700 text-white"
                : "bg-[#101a2f] text-slate-300 hover:bg-[#1a2a45]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => { void loadData(); }}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-[#101a2f] text-slate-400 hover:bg-[#1a2a45] disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Transactions tab */}
      {activeTab === "transactions" && (
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
          <h2 className="text-2xl font-black mb-6">
            All Transactions ({transactions.length})
          </h2>
          {transactions.length === 0 ? (
            <p className="text-slate-500">No transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="pb-3 pr-6">Reference</th>
                    <th className="pb-3 pr-6">Amount</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Provider</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 pr-6 font-mono text-xs">
                        {tx.referenceNumber || tx.id.slice(0, 16)}
                      </td>
                      <td className="py-3 pr-6">
                        {tx.currency} {tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 pr-6">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 pr-6">{tx.provider}</td>
                      <td className="py-3">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subscriptions tab */}
      {activeTab === "subscriptions" && (
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
          <h2 className="text-2xl font-black mb-6">
            Subscriptions ({subscriptions.length})
          </h2>
          {subscriptions.length === 0 ? (
            <p className="text-slate-500">No subscriptions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="pb-3 pr-6">Email</th>
                    <th className="pb-3 pr-6">Plan</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3 pr-6">Provider</th>
                    <th className="pb-3 pr-6">Started</th>
                    <th className="pb-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="py-3 pr-6">{sub.memberEmail}</td>
                      <td className="py-3 pr-6">{sub.planId}</td>
                      <td className="py-3 pr-6">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3 pr-6">{sub.provider}</td>
                      <td className="py-3 pr-6">
                        {new Date(sub.currentPeriodStart).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {new Date(sub.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Members tab */}
      {activeTab === "members" && (
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
          <h2 className="text-2xl font-black mb-6">
            Provisioned Members ({members.length})
          </h2>
          {members.length === 0 ? (
            <p className="text-slate-500">No members provisioned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="pb-3 pr-6">Email</th>
                    <th className="pb-3 pr-6">Tier</th>
                    <th className="pb-3 pr-6">Active</th>
                    <th className="pb-3 pr-6">Dashboard</th>
                    <th className="pb-3">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 pr-6">{m.email}</td>
                      <td className="py-3 pr-6">{m.membershipTier}</td>
                      <td className="py-3 pr-6">
                        <StatusBadge
                          status={m.active ? "active" : "inactive"}
                        />
                      </td>
                      <td className="py-3 pr-6">
                        {m.hasDashboardAccess ? "✓" : "✗"}
                      </td>
                      <td className="py-3">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Webhook events tab */}
      {activeTab === "webhook-events" && (
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
          <h2 className="text-2xl font-black mb-2">
            Processed Webhook Events ({webhookEvents.length})
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Events are retained for 72 hours. Duplicate event IDs are
            automatically rejected.
          </p>
          {webhookEvents.length === 0 ? (
            <p className="text-slate-500">No webhook events recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="pb-3 pr-6">Event ID</th>
                    <th className="pb-3 pr-6">Type</th>
                    <th className="pb-3">Processed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {webhookEvents.slice(0, 50).map((evt) => (
                    <tr key={evt.eventId}>
                      <td className="py-3 pr-6 font-mono text-xs">
                        {evt.eventId}
                      </td>
                      <td className="py-3 pr-6">{evt.eventType}</td>
                      <td className="py-3">
                        {new Date(evt.processedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Refund tab */}
      {activeTab === "refund" && (
        <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8 max-w-xl">
          <h2 className="text-2xl font-black mb-2">Issue Refund</h2>
          <p className="text-slate-400 text-sm mb-6">
            Refunds are processed directly through the Square API. You must
            provide the Square payment ID from the original transaction.
          </p>

          <form onSubmit={(e) => { void handleRefund(e); }} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Square Payment ID *
              </label>
              <input
                type="text"
                value={refundPaymentId}
                onChange={(e) => setRefundPaymentId(e.target.value)}
                required
                placeholder="sq_pay_…"
                className="w-full rounded-lg bg-[#08101f] border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Refund Amount (USD) *
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="39.99"
                className="w-full rounded-lg bg-[#08101f] border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Reason (optional)
              </label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Customer request"
                className="w-full rounded-lg bg-[#08101f] border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {refundResult && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  refundResult.startsWith("✅")
                    ? "bg-green-900/40 text-green-300 border border-green-700"
                    : "bg-red-900/40 text-red-300 border border-red-700"
                }`}
              >
                {refundResult}
              </div>
            )}

            <button
              type="submit"
              disabled={refundLoading}
              className="w-full rounded-xl bg-red-700 px-6 py-3 font-bold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {refundLoading ? "Processing Refund…" : "Issue Refund"}
            </button>
          </form>
        </div>
      )}

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
            <h2 className="text-xl font-black mb-4">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "View Transactions",
                  action: () => setActiveTab("transactions"),
                },
                {
                  label: "View Subscriptions",
                  action: () => setActiveTab("subscriptions"),
                },
                {
                  label: "View Members",
                  action: () => setActiveTab("members"),
                },
                {
                  label: "Webhook Events",
                  action: () => setActiveTab("webhook-events"),
                },
                {
                  label: "Issue Refund",
                  action: () => setActiveTab("refund"),
                },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="rounded-xl border border-blue-500/30 bg-blue-900/20 px-4 py-3 text-left text-sm font-semibold hover:bg-blue-900/40"
                >
                  {label} →
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">
            <h2 className="text-xl font-black mb-4">
              Recent Subscriptions (latest 5)
            </h2>
            {subscriptions.length === 0 ? (
              <p className="text-slate-500 text-sm">No subscriptions yet.</p>
            ) : (
              <div className="space-y-2">
                {subscriptions.slice(0, 5).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between text-sm text-slate-300"
                  >
                    <span>{sub.memberEmail}</span>
                    <span className="text-slate-500">{sub.planId}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
