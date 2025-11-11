// /assets/js/app.js
(function () {
  const DEFAULT_LANG = 'en';
  const saved = localStorage.getItem('edu_lang');
  const currentLang = saved || DEFAULT_LANG;

  function applyLang(lang) {
    const dict = window.EDU_LANG && window.EDU_LANG[lang];
    if (!dict) return;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('edu_lang', lang);
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    applyLang(btn.dataset.lang);
  });

  applyLang(currentLang);
})();
