import Link from "next/link";

import { membershipPlans } from "@/types/membership";

export default function PricingTable() {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full border-collapse">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-5 text-left text-lg font-bold">
              Feature
            </th>

            {membershipPlans.map((plan) => (
              <th
                key={plan.id}
                className="px-6 py-5 text-center"
              >
                <div className="text-2xl font-bold">
                  {plan.name}
                </div>

                <div className="mt-2 text-3xl font-bold text-blue-700">
                  ${plan.monthlyPrice}
                </div>

                <div className="text-sm text-slate-500">
                  Monthly
                </div>
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          <PricingRow
            title="Financial Competency Assessment"
            values={membershipPlans.map(
              plan => plan.assessmentIncluded
            )}
          />

          <PricingRow
            title="Marketplace Access"
            values={membershipPlans.map(
              plan => plan.marketplaceIncluded
            )}
          />

          <PricingRow
            title="AI Financial Coach"
            values={membershipPlans.map(
              plan => plan.aiCoachIncluded
            )}
          />

          <PricingRow
            title="Downloadable Courses"
            values={membershipPlans.map(
              plan => plan.downloadableCourses
            )}
          />

          <PricingRow
            title="Priority Support"
            values={membershipPlans.map(
              plan => plan.prioritySupport
            )}
          />

          <tr className="border-t">

            <td className="px-6 py-5 font-semibold">
              Certificates
            </td>

            {membershipPlans.map(plan => (
              <td
                key={plan.id}
                className="text-center"
              >
                {plan.maxCertificates}
              </td>
            ))}

          </tr>

          <tr className="border-t">

            <td />

            {membershipPlans.map(plan => (

              <td
                key={plan.id}
                className="p-6 text-center"
              >

                <Link
                  href={`/membership/checkout?plan=${plan.id}`}
                  className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Select
                </Link>

              </td>

            ))}

          </tr>

        </tbody>

      </table>

    </section>
  );
}

interface PricingRowProps {

  title: string;

  values: boolean[];

}

function PricingRow({
  title,
  values,
}: PricingRowProps) {

  return (

    <tr className="border-t">

      <td className="px-6 py-5 font-semibold">

        {title}

      </td>

      {values.map((value, index) => (

        <td
          key={index}
          className="text-center text-lg"
        >

          {value ? "✓" : "—"}

        </td>

      ))}

    </tr>

  );

}
