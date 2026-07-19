import { publicMembershipPlans } from "@/types/membership";

export default function MembershipCheckout() {
  return (
    <section
      style={{
        padding: "60px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h2>Membership Checkout</h2>

      {publicMembershipPlans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.monthlyPrice.toFixed(2)} Monthly</p>
        </div>
      ))}

      <p>Membership terms, refund policies, and disclaimers apply.</p>
    </section>
  );
}
