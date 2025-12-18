export default function SpanishHome() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Educación Financiera</h1>
      <p>
        Educación práctica para construir riqueza y tomar decisiones
        informadas.
      </p>

      <footer style={{ marginTop: 40 }}>
        <small>© {new Date().getFullYear()} Edunancial</small>
      </footer>
    </main>
  );
}
