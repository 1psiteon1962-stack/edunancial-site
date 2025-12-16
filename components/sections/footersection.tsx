export default function footersection({ copy }: any) {
  return (
    <footer style={{ padding: "2rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <hr />
      <small>{copy.footerNote}</small>
    </footer>
  );
}
