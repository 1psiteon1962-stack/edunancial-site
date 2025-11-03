// Show/hide nodes with data-lang-show="en|es"
(function(){
  const apply = () => {
    const lang = i18n.get();
    document.querySelectorAll('[data-lang-show]').forEach(el=>{
      el.style.display = (el.getAttribute('data-lang-show') === lang) ? '' : 'none';
    });
  };
  document.addEventListener('lang:change', apply);
  document.addEventListener('DOMContentLoaded', ()=>{
    // Wire buttons
    document.querySelectorAll('.lang-switch [data-lang]').forEach(b=>{
      b.addEventListener('click', ()=> i18n.set(b.dataset.lang));
    });
    apply();
  });
})();
