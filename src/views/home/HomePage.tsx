import { publicMembershipPlans } from "@/types/membership";

export default async function HomePage() {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
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

      <section style={{ marginTop: "50px" }}>
        <h2>Our Mission</h2>

        <p>
          Financial literacy is one of the most important life skills
          a person can develop.
        </p>

        <p>
          Edunancial exists to help bridge the gap between traditional
          education and real-world financial knowledge.
        </p>
      </section>

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

      <section style={{ marginTop: "50px" }}>
        <h2>Membership Options</h2>

        {publicMembershipPlans.map((plan) => (
          <div
            key={plan.name}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>{plan.name}</h3>

            <p>
              {plan.currency} ${plan.monthlyPrice.toFixed(2)}
            </p>

            <ul>
              <li>Financial Literacy Articles</li>
              <li>Educational Resources</li>
              <li>Business Education Content</li>
            </ul>
          </div>
        ))}
      </section>

      <section style={{ marginTop: "50px" }}>
        <h2>Educational Disclaimer</h2>

        <p>
          Edunancial is a financial literacy provider.
        </p>

        <p>
          We provide educational information and educational materials only.
        </p>

        <p>
          Edunancial does not provide loans, credit products, banking
          services, investment advisory services, securities brokerage
          services, insurance products, tax preparation services,
          accounting services, or legal services.
        </p>

        <p>
          Nothing on this website constitutes financial, legal,
          accounting, tax, or investment advice.
        </p>
      </section>

      <section style={{ marginTop: "50px" }}>
        <h2>Growing Financial Literacy Worldwide</h2>

        <p>
          Edunancial is being developed as a long-term financial literacy
          platform designed to serve multiple regions and languages.
        </p>

        <p>
          Future content will include books, courses, educational tools,
          entrepreneurship training, and multilingual financial literacy
          resources.
        </p>
      </section>

      <footer
        style={{
          marginTop: "75px",
          borderTop: "1px solid #ddd",
          paddingTop: "25px",
        }}
      >
        <p>© 2026 Edunancial. All Rights Reserved.</p>

        <p>
          Financial Literacy Provider | Educational Content Only
        </p>

        <p>
          Edunancial does not provide loans, investment advice,
          financial advisory services, legal advice,
          accounting advice, insurance products, or tax advice.
        </p>
      </footer>
    </main>
  );
}
