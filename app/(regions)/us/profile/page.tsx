export default function FounderProfile() {
  const founder = {
    name: "Demo Founder",
    country: "United States",
    revenue: 45000,
    employees: 0,
    hasLLC: true,
    hasHoldingCompany: false,
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Founder Profile</h1>

      <p><strong>Name:</strong> {founder.name}</p>
      <p><strong>Country:</strong> {founder.country}</p>
      <p><strong>Revenue:</strong> ${founder.revenue}</p>
      <p><strong>Employees:</strong> {founder.employees}</p>
      <p><strong>LLC Formed:</strong> {founder.hasLLC ? "Yes" : "No"}</p>
      <p><strong>Holding Company:</strong> {founder.hasHoldingCompany ? "Yes" : "No"}</p>

      <a href="/us/readiness">View Readiness Score</a>
    </main>
  );
}
