// Membership endpoint placeholder (no external deps)
// Keep this to avoid bundling failures from old code that imported node-fetch.
// You can wire real subscription logic later.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  // Echo back request so frontend continues to work
  const payload = JSON.parse(event.body || '{}');
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, received: payload, note: 'Membership creation stub' })
  };
};
