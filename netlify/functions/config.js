// netlify/functions/config.js
exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify({
      applicationId: process.env.SQUARE_APPLICATION_ID,
      locationId: process.env.SQUARE_LOCATION_ID,
    }),
  };
};
