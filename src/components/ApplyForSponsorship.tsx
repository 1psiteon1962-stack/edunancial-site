"use client";

export default function ApplyForSponsorship() {
  return (
    <section style={{ padding: "50px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif", lineHeight: 1.7 }}>
      <h1>Apply For Future Sponsorship</h1>

      <p>
        Entrepreneurs may apply for future financial literacy, mentorship, and
        sponsorship programs. Submission does not guarantee approval, funding,
        grants, loans, or sponsorship.
      </p>

      <form>
        <label>Full Name</label>
        <br />
        <input placeholder="Full Name" />

        <br />
        <br />

        <label>Country</label>
        <br />
        <input placeholder="Country" />

        <br />
        <br />

        <label>Business Type</label>
        <br />
        <input placeholder="Business Type" />

        <br />
        <br />

        <label>Current Monthly Revenue</label>
        <br />
        <input placeholder="Example: 500 USD or local equivalent" />

        <br />
        <br />

        <label>Current Monthly Expenses</label>
        <br />
        <input placeholder="Example: 300 USD or local equivalent" />

        <br />
        <br />

        <label>Describe Your Business</label>
        <br />
        <textarea placeholder="Describe your business, customers, challenges, and goals." rows={8} />

        <br />
        <br />

        <button type="submit">Submit Application</button>
      </form>

      <p>
        Future programs may include mentorship, micro grants, micro loans, and
        sponsor-supported entrepreneur development.
      </p>
    </section>
  );
}
