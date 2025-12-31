import GlobalLayout from "@/components/GlobalLayout";

export default function AfricaPage() {
  return (
    <GlobalLayout title="Africa">
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 600, marginBottom: "1rem" }}>
          Edunancial — Africa
        </h1>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1.5rem" }}>
          Capital clarity across diverse markets
        </h2>

        <p style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
          Africa is not one economy. We address regional realities with disciplined
          capital frameworks and practical execution.
        </p>
      </section>
    </GlobalLayout>
  );
}
