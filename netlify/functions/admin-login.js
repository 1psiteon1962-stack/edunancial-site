// netlify/functions/admin-login.js
const crypto = require("crypto");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { code } = JSON.parse(event.body || "{}");
    if (!code) return { statusCode: 400, body: "Missing code" };

    // 1) Prefer secure env var
    let adminCode = process.env.ADMIN_CODE || "";

    // 2) Fallback to config.json (not ideal, but supports your current flow)
    if (!adminCode) {
      try {
        const cfgUrl = `${process.env.URL || ""}/config.json`;
        if (cfgUrl) {
          const res = await fetch(cfgUrl, { timeout: 5000 });
          if (res.ok) {
            const cfg = await res.json();
            adminCode = (cfg && cfg.ADMIN_CODE) || "";
          }
        }
      } catch (_) {}
    }

    if (!adminCode) {
      return { statusCode: 500, body: "Admin code not configured" };
    }

    if (String(code).trim() !== String(adminCode).trim()) {
      return { statusCode: 401, body: "Invalid code" };
    }

    // tiny HMAC token good for 24h (no external libs)
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 24 * 60 * 60;
    const payload = JSON.stringify({ role: "admin", exp });
    const secret = (process.env.ADMIN_TOKEN_SECRET || adminCode).slice(0, 32);
    const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const token = Buffer.from(payload).toString("base64") + "." + sig;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, exp }),
    };
  } catch (err) {
    return { statusCode: 500, body: "Server error" };
  }
};
