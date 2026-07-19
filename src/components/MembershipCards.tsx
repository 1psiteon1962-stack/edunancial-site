import { publicMembershipPlans } from "@/types/membership";

export default function MembershipCards() {
  return (
    <section
      style={{
        padding: "60px",
        maxWidth: "1000px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
      }}
    >
      {publicMembershipPlans.map((plan) => (
        <div
          key={plan.id}
          style={{
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "12px",
          }}
        >
          <h2>{plan.name}</h2>
          <p>${plan.monthlyPrice.toFixed(2)} Monthly</p>
          <ul>
            <li>Financial Competency Assessment</li>
            <li>Structured Learning Resources</li>
            <li>AI Coach Access</li>
          </ul>
        </div>
      ))}
    </section>
  );
}
