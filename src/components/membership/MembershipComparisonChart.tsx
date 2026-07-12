export default function MembershipComparisonChart() {
  const rows = [
    ["Financial Competency Assessment", "✓", "✓", "✓"],
    ["Structured Learning Paths", "✓", "✓", "✓"],
    ["Learning Resource Library", "Individual", "Organization", "Organization"],
    ["Certificates of Completion", "✓", "✓", "✓"],
    ["AI Financial Coach", "✓", "✓", "✓"],
    ["Download Library", "✓", "✓", "✓"],
    ["Marketplace Access", "Member", "Member", "Priority"],
    ["Business KPI Tools", "✓", "✓", "✓"],
    ["Priority Support", "-", "-", "✓"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Compare Membership Plans
      </h2>

      <div className="mt-14 overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="p-4 text-left">Benefit</th>

              <th className="p-4">Individual</th>

              <th className="p-4">Approved Organization</th>

              <th className="p-4">100+ Organization</th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row) => (

              <tr
                key={row[0]}
                className="border-b border-slate-800"
              >

                <td className="p-4 font-semibold">
                  {row[0]}
                </td>

                <td className="p-4 text-center">
                  {row[1]}
                </td>

                <td className="p-4 text-center">
                  {row[2]}
                </td>

                <td className="p-4 text-center">
                  {row[3]}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}
