export async function getRootPage() {
  return {
    title: 'Edunancial',
    body: {
      code: `
        <div style="padding:20px;">
          <h1>Welcome to Edunancial</h1>
          <p>Your platform is now successfully deployed.</p>
        </div>
      `
    }
  }
}
