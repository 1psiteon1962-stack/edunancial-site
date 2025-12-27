import MembershipGate from "@/app/components/MembershipGate";

export default function AppsPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Edunancial Apps</h1>

      <p>
        This area contains internal tools that support discipline, cash-flow
        mapping, and long-term capital thinking.
      </p>

      <MembershipGate required="Foundation">
        <section
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Founder Console</h2>
          <p>
            This is where gated tools such as analytics, conclusions engines,
            and offer optimizers will live.
          </p>
        </section>
      </MembershipGate>
    </main>
  );
}
