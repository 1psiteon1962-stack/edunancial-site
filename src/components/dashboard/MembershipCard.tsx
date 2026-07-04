interface MembershipCardProps {
  membershipName?: string;
  renewalDate?: string;
  paymentStatus?: string;
}

export default function MembershipCard({
  membershipName = "Basic Membership",
  renewalDate = "Not Available",
  paymentStatus = "Active",
}: MembershipCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Membership
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between">
          <span>Current Plan</span>
          <strong>{membershipName}</strong>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <strong className="text-green-600">
            {paymentStatus}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Renewal Date</span>
          <strong>{renewalDate}</strong>
        </div>

      </div>

      <button
        className="mt-10 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
      >
        Manage Membership
      </button>

    </section>
  );
}
