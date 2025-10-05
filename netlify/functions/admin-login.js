// Simple admin login placeholder – no external fetch
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { token, password } = JSON.parse(event.body || '{}');

  // Basic check – replace with your own validation/store if needed
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || '';
  const ok = !!ADMIN_PASS && password === ADMIN_PASS;

  return {
    statusCode: ok ? 200 : 401,
    body: JSON.stringify({ ok, token: ok ? token || null : null })
  };
};
