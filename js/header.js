/* v5 – universal language toggle with safe fallbacks
   - Swaps EN <-> ES for the same page when an ES file exists
   - If a target ES page is missing, it falls back gracefully to a safe page
   - Also fixes nav links so they always point to existing pages per language
*/
(function () {
  // Tell the script which pages actually exist in ES.
  // (Based on your repo screenshots: no es-catalog.html; yes: es-videos.html, es-contact.html)
  const EXISTING_ES = new Set([
    'index-es.html',
    'memberships-es.html',
    'es-videos.html',
    'es-contact.html'
  ]);

  const MAP_EN_TO_ES = {
    'index.html': 'index-es.html',
    'memberships-en.html': 'memberships-es.html',
    'videos.html': 'es-videos.html',
    'contact.html': 'es-contact.html',
    // No es-catalog.html present → keep catalog in EN to avoid 404
    'catalog.html': 'catalog.html'
  };

  const MAP_ES_TO_EN = {
    'index-es.html': 'index.html',
    'memberships-es.html': 'memberships-en.html',
    'es-videos.html': 'videos.html',
    'es-contact.html': 'contact.html',
    // If someday you add es-catalog.html, also map it here:
    'es-catalog.html': 'catalog.html'
  };

  function fileOnly() {
    const f = location.pathname.split('/').pop();
    return f && f.length ? f : 'index.html';
  }

  function toES(file) {
    const candidate = MAP_EN_TO_ES[file] || (file.startsWith('es-') ? file : ('es-' + file));
    // If candidate is an ES page and it exists in our list, use it.
    if (candidate.endsWith('-es.html') || candidate.startsWith('es-')) {
      if (EXISTING_ES.has(candidate)) return candidate;
      // If not available, fall back: keep same EN page (no 404).
      return file;
    }
    return candidate;
  }

  function toEN(file) {
    return MAP_ES_TO_EN[file] || file.replace(/^es-/, '').replace(/-es\.html$/, '.html');
  }

  // Rewire the EN/ES chips so they never 404
  function wireToggle() {
    const file = fileOnly();
    const enBtn = document.getElementById('langEN');
    const esBtn = document.getElementById('langES');
    if (enBtn) enBtn.addEventListener('click', (e) => { e.preventDefault(); location.href = '/' + toEN(file); });
    if (esBtn) esBtn.addEventListener('click', (e) => { e.preventDefault(); location.href = '/' + toES(file); });
  }

  // Make sure nav links point to the right language versions that actually exist
  function fixNavLinks() {
    const file = fileOnly();
    const isES = file.endsWith('-es.html') || file.startsWith('es-');

    const selectors = [
      ['a[href="/index.html"]',            isES ? '/index-es.html'        : '/index.html'],
      ['a[href="/index-es.html"]',         isES ? '/index-es.html'        : '/index.html'],
      ['a[href="/memberships-en.html"]',   isES ? '/memberships-es.html'  : '/memberships-en.html'],
      ['a[href="/memberships-es.html"]',   isES ? '/memberships-es.html'  : '/memberships-en.html'],
      ['a[href="/videos.html"]',           isES ? '/es-videos.html'       : '/videos.html'],
      ['a[href="/es-videos.html"]',        isES ? '/es-videos.html'       : '/videos.html'],
      ['a[href="/contact.html"]',          isES ? '/es-contact.html'      : '/contact.html'],
      ['a[href="/es-contact.html"]',       isES ? '/es-contact.html'      : '/contact.html'],
      // Catalog → no es-catalog.html in repo; always keep EN to avoid 404
      ['a[href="/catalog.html"]',          '/catalog.html'],
      ['a[href="/es-catalog.html"]',       '/catalog.html']
    ];

    selectors.forEach(([sel, href]) => {
      document.querySelectorAll(sel).forEach(a => a.setAttribute('href', href));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireToggle();
    fixNavLinks();
  });
})();
