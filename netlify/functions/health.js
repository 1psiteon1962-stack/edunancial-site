// Simple health check for deployment validation
exports.handler = async () => {
  return { statusCode: 200, body: 'ok' };
};
