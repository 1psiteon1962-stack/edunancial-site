import fetch from "node-fetch";
const PP_BASE = "https://api-m.paypal.com"; // LIVE
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

async function token(){
  const res = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " + Buffer.from(`${CLIENT}:${SECRET}`).toString("base64") },
    body: "grant_type=client_credentials"
  });
  const j = await res.json();
  if (!res.ok) throw new Error("Auth fail");
  return j.access_token;
}

export async function handler(event){
  try{
    const { orderID } = JSON.parse(event.body||"{}");
    if (!orderID) return { statusCode: 400, body: JSON.stringify({ error:"Missing orderID" }) };

    const access = await token();
    const res = await fetch(`${PP_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer "+access }
    });
    const data = await res.json();
    if (!res.ok) return { statusCode: res.status, body: JSON.stringify(data) };

    // TODO: send confirmation email / Zoom invite via your provider here

    return { statusCode: 200, body: JSON.stringify({ ok:true, data }) };
  } catch (e){
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
