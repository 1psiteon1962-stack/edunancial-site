export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        lineHeight: "1.6",
      }}
    >
      {/* HERO SECTION */}

      <section
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "10px",
          }}
        >
          Edunancial
        </h1>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "normal",
            marginBottom: "30px",
          }}
        >
          Where Education and Financial Literacy Meet
        </h2>

        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto 30px auto",
            fontSize: "1.1rem",
          }}
        >
          Empowering students, entrepreneurs, families, investors,
          and business owners through practical financial education,
          business ownership, investing, and wealth-building strategies.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#0d6efd",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Join Membership
          </button>

          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#ffc107",
              color: "#000000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Explore Courses
          </button>
        </div>
      </section>

      {/* ABOUT */}

      <section
        style={{
          marginTop: "40px",
          padding: "30px",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
        }}
      >
        <h2>About Edunancial</h2>

        <p>
          Edunancial was created to help people understand money,
          business, investing, entrepreneurship, and long-term
          wealth-building. Our mission is to make financial
          education accessible, practical, and actionable for
          every generation.
        </p>

        <p>
          Whether you are starting your first business, learning
          how investing works, purchasing real estate, or preparing
          for retirement, Edunancial provides educational resources
          designed to help you make informed decisions.
        </p>
      </section>

      {/* BOOKS */}

      <section style={{ marginTop: "50px" }}>
        <h2>Featured Books</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h3>Options Trading</h3>

            <p>
              Learn calls, puts, spreads, risk management,
              account setup, and practical options strategies.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h3>Building Wealth with Tax Liens & Tax Deeds</h3>

            <p>
              Understand tax sales, property acquisition,
              interest income opportunities, and real estate
              wealth-building strategies.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h3>Business Is About Making Profit</h3>

            <p>
              Learn the fundamentals of entrepreneurship,
              profitability, systems, and sustainable business growth.
            </p>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}

      <section style={{ marginTop: "60px" }}>
        <h2>Membership Plans</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              border: "2px solid #0d6efd",
              borderRadius: "10px",
              padding: "25px",
            }}
          >
            <h3>Basic Membership</h3>

            <h2>$5 / Month</h2>

            <ul>
              <li>Financial Literacy Resources</li>
              <li>Educational Articles</li>
              <li>Business Fundamentals</li>
              <li>Member Updates</li>
            </ul>
          </div>

          <div
            style={{
              border: "2px solid #ffc107",
              borderRadius: "10px",
              padding: "25px",
            }}
          >
            <h3>Gold Membership</h3>

            <h2>$10 / Month</h2>

            <ul>
              <li>Everything in Basic</li>
              <li>Premium Content</li>
              <li>Advanced Educational Materials</li>
              <li>Priority Updates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FUTURE PRODUCTS */}

      <section
        style={{
          marginTop: "60px",
          padding: "30px",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
        }}
      >
        <h2>Coming Soon</h2>

        <ul>
          <li>Bilingual English / Spanish Courses</li>
          <li>Financial Literacy Programs</li>
          <li>Entrepreneurship Training</li>
          <li>Audiobooks</li>
          <li>Investment Education Resources</li>
          <li>Business Startup Guides</li>
        </ul>
      </section>

      {/* EMAIL FORM */}

      <section
        style={{
          marginTop: "60px",
          textAlign: "center",
        }}
      >
        <h2>Join Our Mailing List</h2>

        <p>
          Receive updates on new books, courses,
          educational content, and membership opportunities.
        </p>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #cccccc",
            }}
          />

          <input
            type="email"
            placeholder="Email Address"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #cccccc",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#0d6efd",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}

      <footer
        style={{
          marginTop: "80px",
          paddingTop: "30px",
          borderTop: "1px solid #dddddd",
          textAlign: "center",
        }}
      >
        <h3>Edunancial, Inc.</h3>

        <p>West Palm Beach, Florida</p>

        <p>Where Education and Financial Literacy Meet</p>

        <p>© 2026 Edunancial. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
