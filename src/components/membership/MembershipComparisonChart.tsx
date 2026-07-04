export default function MembershipComparisonChart() {
  const rows = [
    ["Financial Competency Assessment", "✓", "✓", "✓"],
    ["Learning Roadmap", "✓", "✓", "✓"],
    ["Course Library", "Limited", "Full", "Full"],
    ["Certificates", "-", "✓", "✓"],
    ["AI Financial Coach", "-", "Basic", "Advanced"],
    ["Download Library", "Limited", "✓", "Premium"],
    ["Marketplace Access", "Browse", "Member", "Priority"],
    ["Business KPI Tools", "-", "✓", "Advanced"],
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

              <th className="p-4">Free</th>

              <th className="p-4">Silver</th>

              <th className="p-4">Gold</th>

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
