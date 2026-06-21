export default function SuccessStories() {
  return (
    <section
      style={{
        padding: "60px 20px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h2>Success Stories</h2>

        <p>
          Edunancial believes that financial literacy can transform lives.
        </p>

        <p>
          Over time, this section will showcase individuals,
          families, and entrepreneurs who used financial literacy,
          entrepreneurship, and disciplined decision-making to
          improve their lives.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h3>Financial Literacy</h3>

            <p>
              Learning how money works,
              budgeting, saving,
              and building wealth.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h3>Entrepreneurship</h3>

            <p>
              Building businesses,
              tracking profit,
              and creating opportunities.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h3>Mentorship</h3>

            <p>
              Connecting people with
              mentors who help them
              grow and succeed.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h3>Future Stories</h3>

          <p>
            Edunancial intends to highlight
            real-world stories from North America,
            Africa, Latin America,
            and other regions as the platform grows.
          </p>
        </div>
      </div>
    </section>
  );
}
