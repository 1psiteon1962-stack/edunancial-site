/* /js/header.js  — v8 (global bilingual toggle, no 404s) */
(function () {
  const pairs = [
    ['/index.html',            '/es-our-story.html'],
    ['/memberships-en.html',   '/memberships-es.html'],
    ['/catalog.html',          '/es-catalog.html'],
    ['/videos.html',           '/es-videos.html'],
    ['/contact.html',          '/es-contact.html'],
    ['/refunds.html',          '/es-refunds.html']
  ];

  function partnerPath(path) {
    // normalize:
    if (!path || path === '/' || path === '') path = '/index.html';
    // make sure path has .html
    if (!path.endsWith('.html') && path !== '/') path = '/' + path.replace(/^\//,'');
    // find partner:
    for (const [en, es] of pairs) {
      if (path.endsWith(en)) return es;
      if (path.endsWith(es)) return en;
    }
    // default to story pair
    return path.includes('/es-') ? '/index.html' : '/es-our-story.html';
  }

  function go(to) {
    const here = window.location.pathname.replace(/\/+$/,'') || '/index.html';
    const partner = partnerPath(here);
    if (to === 'es') {
      // if already ES, stay. If EN, go partner (ES)
      if (!here.includes('/es-')) window.location.href = partner;
    } else {
      // to EN
      if (here.includes('/es-')) window.location.href = partner;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const enBtn = document.getElementById('lang-en');
    const esBtn = document.getElementById('lang-es');
    if (enBtn) enBtn.addEventListener('click', (e) => { e.preventDefault(); go('en'); });
    if (esBtn) esBtn.addEventListener('click', (e) => { e.preventDefault(); go('es'); });
  });
})();
