/* pricing-config.js — prices and features */
window.EDN_PRICING = {
  currency: "USD",
  // Base prices (you can change these anytime)
  basic: { monthly: 9, annual: 90 },
  gold: { monthly: 19, annual: 190 },
  // Region adjustment (return multiplier). For now, 1.0 = no change.
  // You can adjust by US state, or later by country/IP.
  regionMultiplier: function () {
    return 1.0;
  },
  features: {
    basic: [
      "Lessons (EN/ES) & templates",
      "Community tips",
      "Newsletter + free pamphlet"
    ],
    gold: [
      "Everything in Basic",
      "Member discounts & specials",
      "Early-bird access to paid videos",
      "Upgrade/cancel anytime"
    ]
  }
};
