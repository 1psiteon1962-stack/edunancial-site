export default function CoursesPage() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "#0b4b8f",
        }}
      >
        Courses
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          lineHeight: "1.7",
          marginBottom: "40px",
        }}
      >
        Edunancial courses are designed to teach financial literacy,
        entrepreneurship, investing, and business development using
        practical examples and real-world case studies.
      </p>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#0b4b8f" }}>
          White – Paper Assets
        </h2>

        <p>
          Learn stocks, bonds, ETFs, options, and portfolio management.
        </p>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#b22222" }}>
          Red – Real Estate
        </h2>

        <p>
          Learn real estate investing, tax liens, tax deeds,
          creative financing, and 1031 exchanges.
        </p>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#003366" }}>
          Blue – Business
        </h2>

        <p>
          Learn entrepreneurship, marketing, profit strategies,
          KPIs, and how to build businesses that generate cash flow.
        </p>
      </section>
    </main>
  );
}
