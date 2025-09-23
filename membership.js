<!-- Include this once on membership.html (and es-membership.html uses same file).
     Make sure the Join buttons have data-tier="STARTER|GROWTH|PRO".
     Requires no other libraries. -->
<script>
(() => {
  const FN_URL = "/.netlify/functions/create-order"; // backend
  const RETURN_URL = `${location.origin}/thank-you.html`;
  const CANCEL_URL  = `${location.origin}/membership.html`;

  // Helper: qs
  const $ = sel => document.querySelector(sel);

  // Elements
  const codeInput      = $('#discount-code');           // <input id="discount-code">
  const emailInput     = $('#mem-email');               // <input id="mem-email">
  const nameInput      = $('#mem-name');                // <input id="mem-name">
  const passInput      = $('#mem-pass');                // optional
  const agreeTos       = $('#agree-tos');               // checkbox (required)
  const agreeEmail     = $('#agree-email');             // optional
  const agreeAge       = $('#agree-age');               // checkbox (required, 18+ or parental)

  // Optional demographics
  const selAgeRange    = $('#dem-age');                 // <select id="dem-age">
  const selEdu         = $('#dem-edu');                 // <select id="dem-edu">
  const selEntre       = $('#dem-entre');               // <select id="dem-entre">

  // Attach click handlers to join buttons
  document.querySelectorAll('[data-tier]').forEach(btn => {
    btn.addEventListener('click', () => startJoin(btn.getAttribute('data-tier')));
  });

  async function startJoin(tierKey) {
    try {
      // Minimal validation
      const email = (emailInput?.value || "").trim();
      const fullName = (nameInput?.value || "").trim();
      const code = (codeInput?.value || "").trim();

      if (!email) { alert("Please enter your email."); return; }
      if (!agreeTos?.checked) { alert("You must agree to Terms & Privacy."); return; }
      if (!agreeAge?.checked) { alert("Please confirm you are 18+ or have consent."); return; }

      // Optional profile payload – nice to store with your CRM later
      const profile = {
        ageRange: selAgeRange?.value || "",
        education: selEdu?.value || "",
        entrepreneurStatus: selEntre?.value || "",
        emailConsent: !!(agreeEmail?.checked),
      };

      const payload = {
        type: "membership",
        membership: tierKey.toUpperCase(), // STARTER | GROWTH | PRO
        code,
        customer: {
          email,
          name: fullName,
          profile
        },
        returnUrl: RETURN_URL,
        cancelUrl: CANCEL_URL,
        currency: "USD"
      };

      // Create order via serverless function
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await r.json();

      if (!r.ok || !data?.approveUrl) {
        console.error("Create order failed:", data);
        alert(data?.body || data?.message || "Could not start PayPal checkout.");
        return;
      }

      // (Optional) show final total/discount before redirect
      // alert(`Total: $${data.total}${Number(data.discount) > 0 ? ` (saved $${data.discount})` : ""}`);

      // Send to PayPal approval
      window.location.href = data.approveUrl;

    } catch (err) {
      console.error(err);
      alert("Error starting checkout.");
    }
  }

  // OPTIONAL: immediate code feedback label
  const codeMsg = $('#code-msg'); // <div id="code-msg"></div>
  codeInput?.addEventListener('input', () => {
    const v = (codeInput.value || '').trim();
    if (!v) { codeMsg && (codeMsg.textContent = ""); return; }
    // Only UI hint – actual validation happens server-side
    codeMsg && (codeMsg.textContent = "Code will be applied at checkout.");
  });
})();
</script>
