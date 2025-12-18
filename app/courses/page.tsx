export const dynamic = 'force-static';

export default function CoursesPage() {
  const heroTitle = 'Courses';
  const storyTitle = 'Learn With Structure';
  const coursesTitle = 'Available Courses';
  const footerNote = 'Education built for real-world application.';

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>{heroTitle}</h1>
      <p>{storyTitle}</p>

      <section>
        <h2>{coursesTitle}</h2>
        <p>
          Our courses are designed to guide you from fundamentals to advanced
          strategy.
        </p>
      </section>

      <footer style={{ marginTop: 40 }}>
        <small>{footerNote}</small>
      </footer>
    </main>
  );
}
