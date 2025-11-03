function readCookie(name){
  return (document.cookie.split('; ').find(r=>r.startsWith(name+'='))||'').split('=')[1]||'';
}
window.edPlan = (readCookie('ed_plan')||'guest').toLowerCase();

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('[data-roles]').forEach(el=>{
    const allowed = el.getAttribute('data-roles').split(',').map(s=>s.trim().toLowerCase());
    if(!allowed.includes(edPlan) && !allowed.includes('public')) el.remove();
  });
});
