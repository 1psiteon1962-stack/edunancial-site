export default async (request, context) => {
  const country = context.geo?.country?.code || "UNKNOWN";
  const blocked = ["RU","CN","KP","IR","VN","BY","TR"];
  if (blocked.includes(country)) {
    return new Response("Access Denied", { status: 403 });
  }

  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  if (/(curl|wget|python-requests|httpclient|libwww-perl|scrapy|spider|crawler|fetchurl|headless)/i.test(ua)) {
    return new Response("Bots not allowed", { status: 403 });
  }

  return context.next();
};
