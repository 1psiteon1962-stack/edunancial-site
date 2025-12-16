export default function appssection({ copy }: any) {
  return (
    <section style={{ padding: "2rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <h3 style={{ fontSize: "1.5rem", margin: 0 }}>{copy.appsTitle}</h3>
      <p style={{ marginTop: "0.75rem" }}>{copy.appsBody}</p>
    </section>
  );
}
