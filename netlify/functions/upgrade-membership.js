// upgrade-membership.js

// Discount rules
const DISC = {
  'EARLYBIRD':   { type: 'flat', entry: 3, standard: 25, premium: 49, note: 'Early adopter pricing' },
  'NP25':        { type: 'percent', pct: 50, note: 'Nonprofit / Student 50% off' },
  'STUDENT50':   { type: 'percent', pct: 50, note: 'Student 50% off' },
  'ANNUAL50':    { type: 'annual', entryYear: 50, standardYear: 300, premiumYear: 600, note: 'Annual prepay offer' },
};

// Normalize codes
const norm = s =>
  (s || '')
    .toString()
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toUpperCase();

// Calculate price based on tier + discount code
function calcPrice(targetVal, codeRaw) {
  const [tier, baseStr] = targetVal.split('|');
  const base = +baseStr;
  const code = norm(codeRaw);
  const rule = DISC[code];
  let price = base;
  let cadence = 'monthly';

  if (rule) {
    if (rule.type === 'flat') {
      price =
        tier === 'STANDARD'
          ? rule.standard
          : tier === 'PREMIUM'
          ? rule.premium
          : rule.entry;
    } else if (rule.type === 'percent') {
      const pct = Math.max(0, Math.min(100, +rule.pct || 0));
      price = +(base * (1 - pct / 100)).toFixed(2);
    } else if (rule.type === 'annual') {
      cadence = 'annual';
      price =
        tier === 'STANDARD'
          ? rule.standardYear
          : tier === 'PREMIUM'
          ? rule.premiumYear
          : rule.entryYear;
    }
  }

  return { price, cadence, note: rule ? rule.note : '' };
}

// Refresh displayed price
function refreshPrice() {
  const targetVal = document.getElementById('targetTier').value;
  const codeRaw = document.getElementById('code').value || '';
  const { price, cadence, note } = calcPrice(targetVal, codeRaw);
  const base = +targetVal.split('|')[1];
  const strike =
    cadence === 'monthly' && price < base
      ? `<span class="strike">$${base.toFixed(2)}/mo</span>`
      : '';
  document.getElementById(
    'priceView'
  ).innerHTML = `${strike} <b>$${price.toFixed(2)}</b> ${
    cadence === 'monthly' ? '/mo' : '/year'
  }`;
  document.getElementById('codeMsg').textContent =
    note || (codeRaw ? 'Code not recognized' : '');
}

// Handle upgrade flow
async function doUpgrade() {
  const email = (document.getElementById('email').value || '').trim();
  if (!email) return setMsg('Please enter your account email.');
  const current = document.getElementById('currentTier').value;
  const targetVal = document.getElementById('targetTier').value;
  const codeRaw = document.getElementById('code').value || '';
  const { price, cadence } = calcPrice(targetVal, codeRaw);
  const targetTier = targetVal.split('|')[0];

  try {
    setMsg('Starting upgrade…');
    const res = await fetch('/.netlify/functions/upgrade-membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        currentTier: current,
        targetTier,
        cadence,
        price,
        code: codeRaw,
        returnUrl: window.location.origin + '/membership-upgrade.html?paid=1',
      }),
    });
    if (!res.ok) throw new Error('Upgrade failed');
    const data = await res.json();
    if (data && data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      throw new Error('Missing redirect URL');
    }
  } catch (e) {
    console.error(e);
    setMsg('Something went wrong. Please try again.', true);
  }
}

// Display message
function setMsg(t, err = false) {
  const el = document.getElementById('msg');
  el.textContent = t;
  el.className = err ? 'danger' : 'muted';
}

// Wire up events
document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('targetTier')
    .addEventListener('change', refreshPrice);
  document.getElementById('code').addEventListener('input', refreshPrice);
  document.getElementById('upgradeBtn').addEventListener('click', doUpgrade);
  refreshPrice();
});
