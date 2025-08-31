<!-- edn-members.js -->
<script>
/* Tiny membership helper for a static site.
   - Stores { tier: "basic"|"gold" } in localStorage under "edn_member".
   - Exposes window.EDN_member(), EDN_setTier(tier), EDN_isGold().
   - Adds body class: .tier-basic or .tier-gold for styling and conditional UI.
*/
(function(){
  const KEY = "edn_member";
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||"{}"); }catch{ return {}; } }
  function write(v){ try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch{} }
  function ensure(){
    const m = read();
    if(!m.tier){ m.tier = "basic"; write(m); }
    return m;
  }
  function applyClass(tier){
    document.documentElement.classList.remove("tier-basic","tier-gold");
    document.documentElement.classList.add(tier==="gold"?"tier-gold":"tier-basic");
  }
  window.EDN_member = function(){ return ensure(); }
  window.EDN_isGold = function(){ return ensure().tier === "gold"; }
  window.EDN_setTier = function(tier){
    const m = ensure(); m.tier = (tier==="gold"?"gold":"basic"); write(m); applyClass(m.tier);
    document.dispatchEvent(new CustomEvent("edn:tierchange",{detail:m.tier}));
  }
  applyClass(ensure().tier);
})();
</script>
