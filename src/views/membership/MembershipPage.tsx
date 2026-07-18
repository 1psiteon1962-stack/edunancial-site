export default function MembershipPage() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1>Membership Plans</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Basic Membership</h2>

        <h3>$24.99 / Month</h3>

        <ul>
          <li>Financial Literacy Resources</li>
          <li>Business Education Articles</li>
          <li>Newsletter Access</li>
        </ul>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>Gold Membership</h2>

        <h3>$59.99 / Month</h3>

        <ul>
          <li>Everything in Basic</li>
          <li>Premium Educational Content</li>
          <li>Priority Access</li>
        </ul>
      </div>
    </main>
  );
}
