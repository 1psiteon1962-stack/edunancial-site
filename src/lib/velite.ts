export async function getRootPage() {
  return {
    title: 'Edunancial',
    body: {
      code: `
        <section style="padding:40px;">
          <h1>Edunancial</h1>
          <p>Your site is live and rendering fallback content.</p>
        </section>
      `,
    },
  }
}
