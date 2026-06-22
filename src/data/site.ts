import {
  SITE_MESSAGE,
  SITE_SUBMESSAGE,
  ORIGIN_STORY_TITLE,
  ORIGIN_STORY,
  ECONOMIC_SELF_DEFENSE,
  DISCLAIMER
} from "../data/site";

export default function HomePage() {
  return (
    <main>

      <section
        style={{
          padding: "80px 20px",
          textAlign: "center",
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >

        <p
          style={{
            color: "#0b4b8f",
            fontWeight: "bold",
            letterSpacing: "2px"
          }}
        >
          FINANCIAL LITERACY • OWNERSHIP • ECONOMIC SELF DEFENSE
        </p>

        <h1
          style={{
            fontSize: "52px",
            marginTop: "20px",
            marginBottom: "25px"
          }}
        >
          {SITE_MESSAGE}
        </h1>

        <p
          style={{
            fontSize: "24px",
            lineHeight: "1.7"
          }}
        >
          {SITE_SUBMESSAGE}
        </p>

      </section>

      <section
        style={{
          background: "#f4f4f4",
          padding: "70px 20px"
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto"
          }}
        >

          <h2>{ORIGIN_STORY_TITLE}</h2>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.8"
            }}
          >
            {ORIGIN_STORY}
          </p>

        </div>

      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "70px 20px"
        }}
      >

        <h2>The Edunancial Framework</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px"
          }}
        >

          <div
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              borderRadius: "12px"
            }}
          >

            <h3 style={{ color: "#cc0000" }}>
              RED
            </h3>

            <h4>
              Real Estate
            </h4>

            <ul>

              <li>Renting vs Buying</li>

              <li>Mortgages</li>

              <li>House Hacking</li>

              <li>Rental Property</li>

              <li>Tax Liens</li>

              <li>Tax Deeds</li>

              <li>Commercial Property</li>

            </ul>

          </div>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              borderRadius: "12px"
            }}
          >

            <h3>
              WHITE
            </h3>

            <h4>
              Paper Assets
            </h4>

            <ul>

              <li>Stocks</li>

              <li>ETFs</li>

              <li>Bonds</li>

              <li>Retirement Accounts</li>

              <li>Dividends</li>

              <li>Precious Metals</li>

              <li>Risk Management</li>

            </ul>

          </div>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              borderRadius: "12px"
            }}
          >

            <h3 style={{ color: "#0047ab" }}>
              BLUE
            </h3>

            <h4>
              Business Ownership
            </h4>

            <ul>

              <li>Business Is About Making Profit</li>

              <li>Revenue vs Profit</li>

              <li>Know Your Numbers</li>

              <li>Pricing</li>

              <li>Margins</li>

              <li>Cash Flow</li>

              <li>Customers</li>

              <li>Scaling</li>

            </ul>

          </div>

        </div>

      </section>

      <section
        style={{
          background: "#f4f4f4",
          padding: "70px 20px"
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto"
          }}
        >

          <h2>
            Economic Self Defense
          </h2>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.8"
            }}
          >

            {ECONOMIC_SELF_DEFENSE}

          </p>

        </div>

      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "70px 20px",
          textAlign: "center"
        }}
      >

        <h2>
          Free Download
        </h2>

        <p>

          Download:

          <strong>

            {" "}10 Rules to Build Wealth

          </strong>

        </p>

        <p>

          Available in English and Spanish.

        </p>

      </section>

      <section
        style={{
          background: "#fff7d6",
          padding: "40px 20px"
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto"
          }}
        >

          <strong>

            Important Disclaimer

          </strong>

          <p>

            {DISCLAIMER}

          </p>

        </div>

      </section>

    </main>
  );
}
