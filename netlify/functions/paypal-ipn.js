// /netlify/functions/paypal-ipn.js
// Node 18+ runtime. Verifies PayPal IPN, maps button -> role, creates/updates user in Netlify Identity, sends invite.

export const config = { path: "/.netlify/functions/paypal-ipn" };

const fetchJson = async (url, opts = {}) => {
  const r = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers||{}) }});
  if (!r.ok) throw new Error(`HTTP ${r.status} ${await r.text()}`);
  return r.json();
};

const parseFormEncoded = (text) =>
  Object.fromEntries(new URLSearchParams(text));

const ROLE_MAP = {
  // Map your PayPal hosted_button_id values to roles + plan info (FILL with your real IDs)
  "HBTN_BASIC_SUB":   { role: "basic",      plan: "Basic $9.99/mo",      recurring: true },
  "HBTN_GROWTH_SUB":  { role: "growth",     plan: "Growth $19.99/mo",    recurring: true },
  "HBTN_PRO_SUB":     { role: "pro",        plan: "Pro $39.99/mo",       recurring: true },
  "HBTN_PLATINUM_BUY":{ role: "platinum",   plan: "Platinum $299 / 2yr", recurring: false },
  "HBTN_SCHOOL":      { role: "institution",plan: "Institution $250/yr", recurring: true },
};

const IDENTITY_URL   = process.env.NETLIFY_IDENTITY_URL;
const ADMIN_TOKEN    = process.env.NETLIFY_IDENTITY_ADMIN_TOKEN;
const IPN_VERIFY_URL = process.env.PAYPAL_IPN_VERIFY_URL || "https://ipnpb.paypal.com/cgi-bin/webscr";
const IPN_SECRET     = process.env.PAYPAL_IPN_SECRET || "";
const MAKE_WEBHOOK   = process.env.MAKE_WEBHOOK_URL;
const FROM_EMAIL     = process.env.DEFAULT_FROM_EMAIL || "support@edunancial.com";

const adminHeaders = { Authorization: `Bearer ${ADMIN_TOKEN}` };

const verifyIPN = async (rawBody) => {
  const body = `cmd=_notify-validate&${rawBody}`;
  const resp = await fetch(IPN_VERIFY_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  const text = await resp.text();
  return text.trim() === "VERIFIED";
};

const attachRole = async (email, role, profile = {}) => {
  // Find or create user
  const findUrl = `${IDENTITY_URL}/admin/users?filter=${encodeURIComponent(email)}`;
  const list = await fetchJson(findUrl, { headers: adminHeaders });
  let user = list.find(u => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Invite (creates dormant account + sends magic link)
    user = await fetchJson(`${IDENTITY_URL}/admin/users`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ email, app_metadata: { roles: [role] }, user_metadata: profile }),
    });
    // send invite email
    await fetchJson(`${IDENTITY_URL}/admin/users/${user.id}/send-invite`, { method: "POST", headers: adminHeaders });
  } else {
    const roles = new Set([...(user.app_metadata?.roles || []), role]);
    user = await fetchJson(`${IDENTITY_URL}/admin/users/${user.id}`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({ app_metadata: { roles: Array.from(roles) }, user_metadata: { ...(user.user_metadata||{}), ...profile } }),
    });
  }
  return user;
};

export default async (req, context) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const rawBody = await req.text();
    // Optional shared secret (if you set one on a forwarding proxy). Skip if blank
    if (IPN_SECRET && req.headers.get("x-ipn-secret") !== IPN_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }

    // Verify with PayPal
    const verified = await verifyIPN(rawBody);
    if (!verified) return new Response("INVALID", { status: 400 });

    const ipn = parseFormEncoded(rawBody);

    // Classic buttons send either 'txn_type=subscr_payment' / 'subscr_signup' / 'web_accept'
    const hostedId = ipn["hosted_button_id"];
    const payerEmail = (ipn["payer_email"] || ipn["receiver_email"] || "").trim();
    if (!hostedId || !payerEmail) return new Response("OK", { status: 200 }); // nothing to do

    const map = ROLE_MAP[hostedId];
    if (!map) return new Response("OK", { status: 200 }); // not a membership we track (e.g., catalog item)

    // Determine status (payment completed / subscription active)
    const status = (ipn["payment_status"] || ipn["txn_type"] || "").toLowerCase();
    const isActive = /completed|subscr_signup|subscr_payment/.test(status);

    if (isActive) {
      const profile = {
        name: `${ipn["first_name"]||""} ${ipn["last_name"]||""}`.trim(),
        plan: map.plan,
        paypal_payer_id: ipn["payer_id"] || "",
        lang: ipn["custom"]?.includes("es") ? "es" : "en",
      };
      await attachRole(payerEmail, map.role, profile);
      // Optional: trigger pamphlet email via Make
      if (MAKE_WEBHOOK) {
        try {
          await fetch(MAKE_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "membership_purchase",
              email: payerEmail,
              name: profile.name,
              plan: map.plan,
              lang: profile.lang || "en",
              from: FROM_EMAIL
            })
          });
        } catch {}
      }
    }

    // Handle cancellations/downgrades
    // txn_type can be 'subscr_cancel', 'subscr_eot', etc. — you can expand here to remove roles.

    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response(`Error ${e.message}`, { status: 500 });
  }
};
