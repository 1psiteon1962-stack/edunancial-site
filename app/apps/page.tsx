export const dynamic = 'force-static';

export default function AppsPage() {
  const heroTitle = 'Apps';
  const storyTitle = 'Interactive Financial Tools';
  const appsTitle = 'Our Applications';
  const footerNote = 'Tools that support decision-making and growth.';

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>{heroTitle}</h1>
      <p>{storyTitle}</p>

      <section>
        <h2>{appsTitle}</h2>
        <p>
          Our apps help assess financial literacy, strategy readiness, and
          execution planning.
        </p>
      </section>

      <footer style={{ marginTop: 40 }}>
        <small>{footerNote}</small>
      </footer>
    </main>
  );
}
