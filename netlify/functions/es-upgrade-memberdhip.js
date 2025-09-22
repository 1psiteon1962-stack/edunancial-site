// /scripts/es-upgrade-membership.js

// Reglas de descuento (mismas que EN)
const DISC = {
  'EARLYBIRD': { type: 'flat', entry: 3, standard: 25, premium: 49, note: 'Precio de lanzamiento' },
  'NP25':      { type: 'percent', pct: 50, note: 'ONG / Estudiante 50%' },
  'STUDENT50': { type: 'percent', pct: 50, note: 'Estudiante 50%' },
  'ANNUAL50':  { type: 'annual', entryYear: 50, standardYear: 300, premiumYear: 600, note: 'Pago anual' },
};

// Normaliza códigos (quita espacios, invisibles, mayúsculas)
const norm = s =>
  (s || '')
    .toString()
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toUpperCase();

// Calcula precio según nivel + código
function calcPrice(targetVal, codeRaw) {
  const [tier, baseStr] = targetVal.split('|');   // p.ej. "STANDARD|29"
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

// Refresca precio mostrado
function refreshPrice() {
  const targetVal = document.getElementById('targetTier').value;
  const codeRaw = document.getElementById('code').value || '';
  const { price, cadence, note } = calcPrice(targetVal, codeRaw);
  const base = +targetVal.split('|')[1];
  const strike =
    cadence === 'monthly' && price < base
      ? `<span class="strike">$${base.toFixed(2)}/mes</span>`
      : '';
  document.getElementById('priceView').innerHTML =
    `${strike} <b>$${price.toFixed(2)}</b> ${cadence === 'monthly' ? '/mes' : '/año'}`;
  document.getElementById('codeMsg').textContent =
    note || (codeRaw ? 'Código no reconocido' : '');
}

// Ejecuta mejora
async function doUpgrade() {
  const email = (document.getElementById('email').value || '').trim();
  if (!email) return setMsg('Ingresa el email de tu cuenta.');
  const current = document.getElementById('currentTier').value; // ENTRY o STANDARD
  const targetVal = document.getElementById('targetTier').value; // "STANDARD|29" o "PREMIUM|59"
  const codeRaw = document.getElementById('code').value || '';
  const { price, cadence } = calcPrice(targetVal, codeRaw);
  const targetTier = targetVal.split('|')[0];

  try {
    setMsg('Iniciando mejora…');
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
        returnUrl: window.location.origin + '/es-membership-upgrade.html?paid=1',
      }),
    });
    if (!res.ok) throw new Error('Fallo en la mejora');
    const data = await res.json();
    if (data && data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      throw new Error('Sin URL de redirección');
    }
  } catch (e) {
    console.error(e);
    setMsg('Ocurrió un error. Intenta de nuevo.', true);
  }
}

// Mensajes
function setMsg(t, err = false) {
  const el = document.getElementById('msg');
  el.textContent = t;
  el.className = err ? 'danger' : 'muted';
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('targetTier').addEventListener('change', refreshPrice);
  document.getElementById('code').addEventListener('input', refreshPrice);
  document.getElementById('upgradeBtn').addEventListener('click', doUpgrade);
  refreshPrice();
});
