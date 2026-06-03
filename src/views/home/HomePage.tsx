import { loadPricing } from "@/lib/pricing";

export default async function HomePage() {
  const pricing = await loadPricing("us");

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HERO SECTION */}

      <section>
        <h1>Edunancial</h1>

        <h2>Financial Literacy for the Next Generation</h2>

        <p>
          Edunancial is a financial literacy provider dedicated to helping
          individuals improve their understanding of personal finance,
          entrepreneurship, business ownership, investing concepts,
          and long-term wealth-building principles.
        </p>

        <p>
          Through educational resources, books, articles, courses,
          and training materials, our goal is to help current and
          future generations develop stronger financial knowledge,
          better decision-making skills, and greater economic opportunity.
        </p>
      </section>

      {/* MISSION */}

      <section style={{ marginTop: "50px" }}>
        <h2>Our Mission</h2>

        <p>
          Financial literacy is one of the most important life skills
          a person can develop. Unfortunately, many people graduate
          from school without receiving practical education regarding
          money management, entrepreneurship, investing, business
          ownership, taxes, credit, and long-term wealth building.
        </p>

        <p>
          Edunancial exists to help bridge that gap.
        </p>
      </section>

      {/* WHAT WE TEACH */}

      <section style={{ marginTop: "50px" }}>
        <h2>What We Teach</h2>

        <ul>
          <li>Financial Literacy</li>
          <li>Personal Finance</li>
          <li>Entrepreneurship</li>
          <li>Business Ownership</li>
          <li>Business Formation</li>
          <li>Investing Concepts</li>
          <li>Wealth Building Principles</li>
          <li>Financial Readiness</li>
          <li>Credit Fundamentals</li>
          <li>Long-Term Strategic Thinking</li>
        </ul>
      </section>

      {/* WHO WE SERVE */}

      <section style={{ marginTop: "50px" }}>
        <h2>Who We Serve</h2>

        <ul>
          <li>Students</li>
          <li>Young Adults</li>
          <li>Parents</li>
          <li>Entrepreneurs</li>
          <li>Small Business Owners</li>
          <li>Professionals Seeking Financial Education</li>
          <li>Individuals Pursuing Financial Independence</li>
        </ul>
      </section>

      {/* IMPORTANT DISCLAIMER */}

      <section style={{ marginTop: "50px" }}>
        <h2>Educational Disclaimer</h2>

        <p>
          Edunancial is a financial literacy provider.
        </p>

        <p>
          We provide educational information and educational materials
          only.
        </p>

        <p>
          Edunancial does not provide loans, credit products, banking
          services, securities brokerage services, investment advisory
          services, wealth management services, insurance products,
          tax preparation services, accounting services, or legal services.
        </p>

        <p>
          Nothing on this website should be considered financial,
          legal, accounting, investment, tax, or professional advice.
        </p>

        <p>
          Readers should consult appropriately licensed professionals
          before making financial, investment, legal, accounting,
          insurance, or tax decisions.
        </p>
      </section>

      {/* MEMBERSHIP */}

      <section style={{ marginTop: "50px" }}>
        <h2>Membership Options</h2>

        {pricing.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>{plan.name}</h3>

            <p>
              {plan.currency} ${plan.price}
            </p>

            <ul>
              {plan.features.map((feature: string) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* FUTURE GROWTH */}

      <section style={{ marginTop: "50px" }}>
        <h2>Growing Financial Literacy Worldwide</h2>

        <p>
          Edunancial is being developed as a long-term financial literacy
          platform designed to serve multiple regions and languages.
        </p>

        <p>
          Future content will include additional educational resources,
          books, courses, entrepreneurship training, and multilingual
          financial literacy materials.
        </p>
      </section>

      {/* FOOTER */}

      <footer
        style={{
          marginTop: "75px",
          borderTop: "1px solid #ddd",
          paddingTop: "25px",
        }}
      >
        <p>
          © 2026 Edunancial. All Rights Reserved.
        </p>

        <p>
          Financial Literacy Provider | Educational Content Only
        </p>

        <p>
          Edunancial does not provide loans, investment advice,
          financial advisory services, legal advice, accounting
          advice, insurance products, or tax advice.
        </p>
      </footer>
    </main>
  );
}
