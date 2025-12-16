export default function herosection({ copy }: any) {
  return (
    <section style={{ padding: "2rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", margin: 0 }}>{copy.heroTitle}</h2>
      <p style={{ marginTop: "0.75rem" }}>{copy.heroBody}</p>
    </section>
  );
}
