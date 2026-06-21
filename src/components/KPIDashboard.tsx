type Props = {
  revenue: number;
  expenses: number;
  customers: number;
};

export default function KPIDashboard({ revenue, expenses, customers }: Props) {
  const profit = revenue - expenses;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const averageRevenuePerCustomer = customers > 0 ? revenue / customers : 0;

  return (
    <section style={{ padding: "40px", border: "1px solid #ddd", borderRadius: "12px", maxWidth: "800px", margin: "40px auto", fontFamily: "Arial, sans-serif", lineHeight: 1.7 }}>
      <h2>Business KPI Dashboard</h2>

      <p>
        Business owners need numbers. No numbers means no valid response.
      </p>

      <p><strong>Revenue:</strong> ${revenue.toFixed(2)}</p>
      <p><strong>Expenses:</strong> ${expenses.toFixed(2)}</p>
      <p><strong>Profit:</strong> ${profit.toFixed(2)}</p>
      <p><strong>Profit Margin:</strong> {profitMargin.toFixed(2)}%</p>
      <p><strong>Customers:</strong> {customers}</p>
      <p><strong>Average Revenue Per Customer:</strong> ${averageRevenuePerCustomer.toFixed(2)}</p>
    </section>
  );
}
