export default function ContactPage() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Contact Edunancial</h1>

      <p>
        Questions, partnership inquiries, speaking opportunities,
        or membership support?
      </p>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email Address" />
        <input type="text" placeholder="Subject" />

        <textarea
          placeholder="Message"
          rows={8}
        />

        <button type="submit">
          Send Message
        </button>
      </form>
    </main>
  );
}
