/* Simple gate: if cookie ed_member in {"GROWTH","PRO","PLATINUM","ELITE","INSTITUTIONAL"} show member buttons */
(function(){
  function get(name){
    const m=document.cookie.match(new RegExp('(?:^|; )'+name.replace(/([.$?*|{}()[\]\\/+^])/g,'\\$1')+'=([^;]*)'));
    return m?decodeURIComponent(m[1]):"";
  }
  const tier=get('ed_member'); // set after PayPal return or via email link
  document.addEventListener('DOMContentLoaded',()=>{
    const isGrowth=tier==="GROWTH", isPro=tier==="PRO"||tier==="PLATINUM"||tier==="ELITE"||tier==="INSTITUTIONAL";
    document.querySelectorAll('[data-public]').forEach(x=>x.style.display=(isPro||isGrowth)?'none':'inline-block');
    document.querySelectorAll('[data-growth]').forEach(x=>x.style.display=isGrowth?'inline-block':'none');
    document.querySelectorAll('[data-member]').forEach(x=>x.style.display=isPro?'inline-block':'none');
  });
})();
