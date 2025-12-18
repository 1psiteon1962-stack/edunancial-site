export default function coursessection({ copy }: any) {
  return (
    <section style={{ padding: "2rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <h3 style={{ fontSize: "1.5rem", margin: 0 }}>{copy.coursesTitle}</h3>
      <p style={{ marginTop: "0.75rem" }}>{copy.coursesBody}</p>
    </section>
  );
}
