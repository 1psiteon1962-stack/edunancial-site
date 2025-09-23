/* ============================================================
   Edunancial — Membership Frontend Logic
   File: /membership.js
   Purpose:
     - Handle tier selection & live price display
     - Accept/annotate discount codes (authoritative pricing on server)
     - Collect account/profile/consents
     - Create PayPal order via /.netlify/functions/create-order
     - Temporary admin bypass for QA (hash-protected)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- CONFIG ---------- */

  // Public display prices (final price is always enforced on the server)
  const TIER_PRICES = {
    starter: 5.00,
    growth: 15.00,
    pro: 25.00,
  };

  // Put the SHA-256 of YOUR admin code here (hex string).
  // To generate in any browser console:
  //   async function hash(s){const d=new TextEncoder().encode(s);
  //     const b=await crypto.subtle.digest('SHA-256',d);
  //     return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
  //   hash('YOUR-SECRET-CODE')
  const ADMIN_HASH = "PUT_SHA256_OF_YOUR_ADMIN_CODE_HERE";

  // Netlify function endpoint that creates the PayPal order
  const CREATE_ORDER_ENDPOINT = "/.netlify/functions/create-order";

  /* ---------- HELPERS ---------- */

  function $(sel) { return document.querySelector(sel); }
  function val(id) { return (document.getElementById(id)?.value || "").trim(); }

  async function sha256(s) {
    const data = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function setBtnBusy(btn, busy, labelWhileBusy) {
    if (!btn) return;
    btn.disabled = !!busy;
    if (busy && labelWhileBusy) btn.dataset._label = btn.textContent, btn.textContent = labelWhileBusy;
    if (!busy && btn.dataset._label) btn.textContent = btn.dataset._label, delete btn.dataset._label;
  }

  function updatePriceDisplay(tier, spanEl) {
    const base = TIER_PRICES[tier] ?? TIER_PRICES.starter;
    if (spanEl) spanEl.textContent = `$${base.toFixed(2)} /mo`;
  }

  /* ---------- ADMIN BYPASS (for QA only) ---------- */

  async function onAdminUnlock() {
    const code = val("adminCode");
    if (!code) return alert("Enter admin code.");

    try {
      const h = await sha256(code);
      if (h === ADMIN_HASH) {
        localStorage.setItem("edunancial_admin", "1");
        alert("Admin unlocked for this browser session.");
      } else {
        alert("Incorrect admin code.");
      }
    } catch (e) {
      console.error(e);
      alert("Could not verify admin code.");
    }
  }

  /* ---------- MAIN JOIN FLOW ---------- */

  async function onJoinClick() {
    const joinBtn = $("#joinWithPayPal");
    const joinMsg = $("#joinMsg");
    setBtnBusy(joinBtn, true, "Creating order…");
    setText(joinMsg, "Creating PayPal order…");

    try {
      const payload = {
        type: "membership",
        level: $("#tierSelect")?.value || "starter",
        discountCode: val("discountInput"),
        customer: {
          name:  val("nameInput"),
          email: val("emailInput"),
          ageRange: $("#ageRange")?.value || "",
          eduLevel: $("#eduLevel")?.value || "",
          entrepreneur: $("#entreStatus")?.value || "",
        },
        consents: {
          terms: !!$("#agreeTerms")?.checked,
          email: !!$("#agreeEmail")?.checked,
          age:   !!$("#agreeAge")?.checked,
        },
      };

      // Minimal client validations (server still re-validates)
      if (!payload.customer.name || !payload.customer.email) {
        setText(joinMsg, "Name and email are required.");
        setBtnBusy(joinBtn, false);
        return;
      }
      if (!payload.consents.terms || !payload.consents.age) {
        setText(joinMsg, "Please agree to Terms and the age statement.");
        setBtnBusy(joinBtn, false);
        return;
      }

      const res = await fetch(CREATE_ORDER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server responded ${res.status}: ${txt}`);
      }

      const data = await res.json();
      // Expected: { approveUrl, orderId, displayAmount }
      if (data?.displayAmount) {
        updatePriceDisplay(payload.level, $("#priceToday")); // keep UI sane
        setText($("#priceToday"), `$${Number(data.displayAmount).toFixed(2)} /mo`);
      }

      if (data?.approveUrl) {
        window.location.href = data.approveUrl; // redirect to PayPal
        return;
      }

      throw new Error("No approval URL returned by server.");
    } catch (err) {
      console.error(err);
      setText(joinMsg, "Could not start PayPal checkout. Please try again.");
    } finally {
      setBtnBusy($("#joinWithPayPal"), false);
    }
  }

  /* ---------- INIT / EVENT WIRING ---------- */

  function init() {
    // Price display wiring
    const tierSel = $("#tierSelect");
    const priceSpan = $("#priceToday");
    updatePriceDisplay(tierSel?.value || "starter", priceSpan);
    tierSel?.addEventListener("change", () => updatePriceDisplay(tierSel.value, priceSpan));

    // Discount field hint (visual only; server applies real discount)
    $("#discountInput")?.addEventListener("input", () => {
      const msg = $("#discountMsg");
      const code = val("discountInput");
      setText(msg, code ? "Code entered — will be applied at checkout." : "");
    });

    // Action buttons
    $("#joinWithPayPal")?.addEventListener("click", onJoinClick);
    $("#adminUnlock")?.addEventListener("click", onAdminUnlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
