/* Edunancial header/cart bootstrap — v2 */
(function () {
  const CART_KEY = 'edn_cart_v1';

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : { items: [] };
    } catch {
      return { items: [] };
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge(cart);
  }

  function updateBadge(cart = readCart()) {
    const n = cart.items.reduce((sum, it) => sum + (it.qty || 1), 0);
    const el = document.getElementById('cart-badge');
    if (el) el.textContent = String(n);
  }

  function normalizePrice(p) {
    // accepts "18.99" or 18.99
    const n = typeof p === 'string' ? parseFloat(p.replace(/[^0-9.]/g, '')) : Number(p);
    return isFinite(n) ? n : 0;
  }

  function addToCart(attrs) {
    const { id, name, price, variant } = attrs;
    if (!id || !name) return;

    const cart = readCart();
    const key = `${id}__${variant || ''}`.toLowerCase();

    const existing = cart.items.find(
      it => `${it.id}__${it.variant || ''}`.toLowerCase() === key
    );

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.items.push({
        id,
        name,
        variant: variant || null,
        price: normalizePrice(price),
        qty: 1
      });
    }

    writeCart(cart);
  }

  function buttonFeedback(btn) {
    const orig = btn.getAttribute('data-label') || btn.textContent;
    const added = btn.getAttribute('data-added') || 'Added ✓';
    btn.textContent = added;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
    }, 900);
  }

  function wireButtons(root = document) {
    const btns = root.querySelectorAll('[data-add-to-cart]');
    btns.forEach(btn => {
      // make sure forms don't submit
      if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');

      if (btn._edn_wired) return; // avoid double wiring on SPA-like nav
      btn._edn_wired = true;

      btn.addEventListener('click', () => {
        const attrs = {
          id: btn.getAttribute('data-id') || btn.getAttribute('data-sku'),
          name: btn.getAttribute('data-name') || 'Item',
          price: btn.getAttribute('data-price') || '0',
          variant: btn.getAttribute('data-variant') || null
        };
        addToCart(attrs);
        buttonFeedback(btn);
      }, { passive: true });
    });
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    wireButtons();
  });

  // Also expose a tiny API if needed elsewhere
  window.EDN_CART = {
    add: addToCart,
    get: readCart,
    save: writeCart,
    refresh: updateBadge,
    wire: wireButtons
  };
})();
