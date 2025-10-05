/* Edunancial pricing helper
   - Default Basic = $9.99/mo
   - Admin-only discount to $5: add ?promo=basic5 or ?admin=1 for on-page buttons
   - Discount persists in localStorage for 30 days
*/

(function () {
  const qs = new URLSearchParams(location.search);
  const PRICE_KEY = "edunancial_basic_price";
  const EXP_KEY = "edunancial_basic_price_exp";

  function setLocalPrice(amount, days = 30) {
    localStorage.setItem(PRICE_KEY, String(amount));
    const exp = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(EXP_KEY, String(exp));
  }
  function clearLocalPrice() {
    localStorage.removeItem(PRICE_KEY);
    localStorage.removeItem(EXP_KEY);
  }
  function getLocalPrice() {
    const v = localStorage.getItem(PRICE_KEY);
    const exp = Number(localStorage.getItem(EXP_KEY) || 0);
    if (!v) return null;
    if (exp && Date.now() > exp) {
      clearLocalPrice();
      return null;
    }
    return Number(v);
  }

  function dollars(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function applyPrice(amount) {
    // Update prices on both EN/ES pages
    document.querySelectorAll(".price-basic").forEach(el => {
      el.textContent = dollars(amount);
    });
    const join = document.getElementById("join-basic");
    if (join) {
      const url = new URL(join.getAttribute("href"), location.origin);
      url.searchParams.set("price", String(amount));
      join.setAttribute("href", url.pathname + "?" + url.searchParams.toString());
    }
    // Add a small badge so you can see it's discounted
    if (amount <= 5) {
      let badge = document.getElementById("discount-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.id = "discount-badge";
        badge.className = "badge";
        badge.textContent = "Discount";
        // insert after the first .price-basic
        const target = document.querySelector(".price-basic");
        if (target && target.parentNode) target.parentNode.insertBefore(badge, target.nextSibling);
      }
    } else {
      const b = document.getElementById("discount-badge");
      if (b) b.remove();
    }
  }

  // Defaults from markup
  const defaultPrice = Number(document.querySelector(".price-basic")?.dataset.priceDefault || 9.99);

  // 1) apply promo from URL
  if (qs.get("promo") === "basic5") {
    setLocalPrice(5, 30);
    history.replaceState({}, "", location.pathname); // clean URL
  }
  // 2) admin quick set via URL (?set_basic=5)
  const setBasic = Number(qs.get("set_basic"));
  if (!isNaN(setBasic) && setBasic > 0) {
    setLocalPrice(setBasic, 30);
    history.replaceState({}, "", location.pathname);
  }

  // 3) read stored price, else default
  const stored = getLocalPrice();
  applyPrice(stored ?? defaultPrice);

  // 4) admin buttons show only with ?admin=1
  if (qs.get("admin") === "1") {
    const box = document.getElementById("admin-controls");
    if (box) box.style.display = "flex";
    const set5 = document.getElementById("set-5");
    const clr = document.getElementById("clear-discount");
    if (set5) set5.addEventListener("click", () => { setLocalPrice(5); applyPrice(5); });
    if (clr) clr.addEventListener("click", () => { clearLocalPrice(); applyPrice(defaultPrice); });
  }
})();
