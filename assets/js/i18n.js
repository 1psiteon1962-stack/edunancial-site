// Simple language state
window.i18n = {
  get(){ return localStorage.getItem('lang') || 'en'; },
  set(lang){ localStorage.setItem('lang', lang); document.dispatchEvent(new CustomEvent('lang:change',{detail:lang})); }
};
