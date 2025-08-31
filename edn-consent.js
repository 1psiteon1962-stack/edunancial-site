<script>
// naive region detection: EU/UK via timezone/country code hints; California via timezone + language
// This avoids showing a banner to everyone.
function ednShouldShowConsent(){
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language||"en").toLowerCase();

    // EU/UK timezones (not exhaustive, but good enough):
    const euLike = /(Europe\/|GMT|WET|CET|EET)/.test(tz);
    const ukLike = tz.includes("Europe/London");

    // California heuristic (Pacific time + English/Spanish)
    const usPacific = /America\/(Los_Angeles|Vancouver|Tijuana)/.test(tz);
    const caLike = usPacific && /(en|es)-us/.test(lang);

    return euLike || ukLike || caLike;
  } catch(e){
    return false;
  }
}

function ednInitConsent(){
  if (!ednShouldShowConsent()) return;
  if (localStorage.getItem("edn_cookie_ok")) return;

  const lang = document.documentElement.getAttribute("lang") || "en";
  const t = EDN_I18N[lang];

  const bar = document.createElement("div");
  bar.style.position="fixed";
  bar.style.left="0"; bar.style.right="0"; bar.style.bottom="0";
  bar.style.background="#0b3b82"; bar.style.color="white";
  bar.style.padding="14px"; bar.style.zIndex="9999";
  bar.style.display="flex"; bar.style.flexWrap="wrap"; bar.style.gap="10px"; bar.style.alignItems="center"; bar.style.justifyContent="center";
  bar.innerHTML = `
    <span style="max-width:720px">${t.cookie_text}</span>
    <button id="edn-yes" style="padding:8px 14px;border:0;border-radius:10px;background:white;color:#0b3b82;font-weight:700">${t.cookie_yes}</button>
    <button id="edn-no"  style="padding:8px 14px;border:2px solid #fff;border-radius:10px;background:transparent;color:#fff">${t.cookie_no}</button>
  `;
  document.body.appendChild(bar);
  bar.querySelector("#edn-yes").onclick = ()=>{ localStorage.setItem("edn_cookie_ok","1"); bar.remove(); };
  bar.querySelector("#edn-no").onclick  = ()=>{ bar.remove(); };
}

document.addEventListener("DOMContentLoaded", ednInitConsent);
window.addEventListener("edn:lang", ()=>{ document.querySelectorAll("#edn-yes,#edn-no").forEach(b=>b.parentElement?.remove()); ednInitConsent(); });
</script>
