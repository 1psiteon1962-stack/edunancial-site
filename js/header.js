<script>
// ===== Language Toggle (single-language per page) =====
// Expected page pairs:
//   index.html            <-> index-es.html
//   memberships-en.html   <-> memberships-es.html
//   our-story.html        <-> es-our-story.html    (if used)
//   catalog.html          <-> es-catalog.html      (when you add it)

(function() {
  function pathName() {
    return window.location.pathname.replace(/\/+$/,''); // strip trailing slash
  }

  // Map current path -> target path for ES/EN
  function swapLang(to) {
    const p = pathName();

    // Home
    if (p === '' || p === '/' || p.endsWith('/index.html')) {
      return (to === 'es') ? '/index-es.html' : '/index.html';
    }
    if (p.endsWith('/index-es.html')) {
      return (to === 'es') ? '/index-es.html' : '/index.html';
    }

    // Memberships
    if (p.endsWith('/memberships-en.html')) {
      return (to === 'es') ? '/memberships-es.html' : '/memberships-en.html';
    }
    if (p.endsWith('/memberships-es.html')) {
      return (to === 'es') ? '/memberships-es.html' : '/memberships-en.html';
    }

    // Our Story (optional pair you already have)
    if (p.endsWith('/our-story.html')) {
      return (to === 'es') ? '/es-our-story.html' : '/our-story.html';
    }
    if (p.endsWith('/es-our-story.html')) {
      return (to === 'es') ? '/es-our-story.html' : '/our-story.html';
    }

    // Catalog (add Spanish file later if needed)
    if (p.endsWith('/catalog.html')) {
      return (to === 'es') ? '/catalog.html' : '/catalog.html';
    }
    if (p.endsWith('/es-catalog.html')) {
      return (to === 'es') ? '/es-catalog.html' : '/catalog.html';
    }

    // Fallback: just send to home in requested language
    return (to === 'es') ? '/index-es.html' : '/index.html';
  }

  // Wire up buttons with IDs: #btn-en and #btn-es
  function bindLangButtons(){
    const en = document.querySelector('#btn-en');
    const es = document.querySelector('#btn-es');
    if (en) en.addEventListener('click', function(e){ e.preventDefault(); window.location.href = swapLang('en'); });
    if (es) es.addEventListener('click', function(e){ e.preventDefault(); window.location.href = swapLang('es'); });
  }

  document.addEventListener('DOMContentLoaded', bindLangButtons);
})();
</script>
