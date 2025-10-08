// netlify/functions/send-email.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode:405, body:'Method Not Allowed' };
  const { SENDGRID_API_KEY, FROM_EMAIL } = process.env;
  const { to, subject, html } = JSON.parse(event.body||'{}');
  if (!SENDGRID_API_KEY || !FROM_EMAIL || !to) return { statusCode:400, body:'Missing' };

  const fetch = (await import('node-fetch')).default;
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${SENDGRID_API_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({
      personalizations:[{ to:[{ email: to }] }],
      from:{ email: FROM_EMAIL, name:'Edunancial' },
      subject, content:[{ type:'text/html', value: html }]
    })
  });
  return { statusCode: res.ok?200:500, body: res.ok?'OK':'Email failed' };
};
