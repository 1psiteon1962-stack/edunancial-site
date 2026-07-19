import { publicMembershipPlans } from "@/types/membership";

export default function MembershipPage() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1>Membership Plans</h1>

      {publicMembershipPlans.map((plan) => (
        <div
          key={plan.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>{plan.name}</h2>

          <h3>${plan.monthlyPrice.toFixed(2)} / Month</h3>

          <ul>
            <li>Financial Literacy Resources</li>
            <li>Business Education Articles</li>
            <li>Newsletter Access</li>
          </ul>
        </div>
      ))}
    </main>
  );
}
