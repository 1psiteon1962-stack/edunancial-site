export default async (request, context) => {
  const blocked = ["RU", "CN", "KP", "IR", "VN", "BY", "TR"];
  const country = context.geo.country?.code || "??";

  if (blocked.includes(country)) {
    return new Response(
      `Access from ${country} is restricted.`,
      { status: 403, headers: { "content-type": "text/plain" } }
    );
  }

  if (country === "IN") {
    return new Response(
      `Traffic from ${country} requires verification.`,
      { status: 403, headers: { "content-type": "text/plain" } }
    );
  }

  return context.next();
};
