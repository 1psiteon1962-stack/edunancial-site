export default function SponsorDashboard() {
  return (
    <section
      style={{
        padding: "60px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h2>Sponsor Dashboard</h2>

      <p>
        Welcome to the Edunancial Sponsor Dashboard.
      </p>

      <p>
        Sponsors help expand access to financial literacy,
        entrepreneurship training, educational resources,
        and future capital-access programs.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Students Reached</h3>
          <p>Tracking available in future releases.</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Entrepreneurs Supported</h3>
          <p>Tracking available in future releases.</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Community Impact</h3>
          <p>Reporting available in future releases.</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Sponsorship Mission</h3>

        <p>
          Edunancial seeks to improve financial literacy,
          entrepreneurship education, and long-term economic
          opportunity for individuals and communities.
        </p>
      </div>
    </section>
  );
}
