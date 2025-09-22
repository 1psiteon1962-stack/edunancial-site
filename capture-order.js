// Captures a PayPal order and emails the buyer a Zoom invite (SendGrid)
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async (event) => {
  try {
    if(event.httpMethod!=="POST") return { statusCode:405, body:"Method Not Allowed" };
    const { orderID } = JSON.parse(event.body || "{}");
    if(!orderID) return { statusCode:400, body:"Missing orderID" };

    const token = await getAccessToken();

    // Capture
    const capRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method:"POST",
      headers:{ "Content-Type":"application/json","Authorization":`Bearer ${token}` }
    });
    const cap = await capRes.json();
    if(!capRes.ok) return { statusCode: capRes.status, body: JSON.stringify(cap) };

    // Pull email from custom_id metadata
    let email = null;
    try{
      const custom = cap?.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
                  || cap?.purchase_units?.[0]?.custom_id;
      if(custom) email = JSON.parse(Buffer.from(custom, "base64url").toString("utf8")).email;
    }catch{}

    if(email){
      await sendEmail(email, orderID);
      const bcc = process.env.EDUNANCIAL_ADMIN_EMAIL;
      if(bcc) await sendEmail(bcc, orderID, true);
    }

    return { statusCode:200, body: JSON.stringify({ ok:true }) };
  } catch(err){
    return { statusCode:500, body: err.message || "Server error" };
  }
};

async function getAccessToken(){
  const id = process.env.PAYPAL_CLIENT_ID;
  const sec = process.env.PAYPAL_CLIENT_SECRET;
  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded",
              "Authorization":"Basic " + Buffer.from(id + ":" + sec).toString("base64") },
    body:"grant_type=client_credentials"
  });
  const j = await res.json();
  if(!res.ok) throw new Error(j.error_description || "token failure");
  return j.access_token;
}

async function sendEmail(to, orderID, isBcc=false){
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.EDUNANCIAL_FROM_EMAIL || "no-reply@edunancial.com";
  if(!key) return;

  const subject = isBcc ? `New Edunancial order ${orderID}` : "Your Edunancial Zoom invite";
  const text = isBcc
    ? `Order ${orderID} captured successfully.`
    : `Thank you for your purchase!\n\nZoom access (sample):\nJoin: https://zoom.us/j/123456789\nPasscode: 2468\n\nOrder: ${orderID}\n\n— Edunancial`;

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method:"POST",
    headers:{ "Authorization":`Bearer ${key}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      personalizations:[{ to:[{ email: to }] }],
      from:{ email: from, name:"Edunancial" },
      subject, content:[{ type:"text/plain", value:text }]
    })
  });
}
