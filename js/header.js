// /js/header.js  — Language toggle that never 404s
(function () {
  function fileOnly() {
    // current filename (default index.html)
    const f = location.pathname.split('/').pop();
    return f && f.length ? f : 'index.html';
  }

  // Map EN <-> ES filenames (handles special cases first)
  function toES(file) {
    if (file === 'index.html') return 'index-es.html';
    if (file === 'memberships-en.html') return 'memberships-es.html';
    if (/^es-/.test(file) || /-es\.html$/.test(file)) return file; // already ES
    return 'es-' + file;
  }
  function toEN(file) {
    if (file === 'index-es.html') return 'index.html';
    if (file === 'memberships-es.html') return 'memberships-en.html';
    return file.replace(/^es-/, '');
  }

  // Enhance any toggle buttons/links
  function wire() {
    const file = fileOnly();

    // Fallback hrefs so even if JS fails you never hit 404
    const enBtn = document.getElementById('langEN');
    const esBtn = document.getElementById('langES');

    if (enBtn) {
      enBtn.setAttribute('href', '/index.html');              // safe fallback
      enBtn.addEventListener('click', function (e) {
        e.preventDefault();
        location.href = '/' + toEN(file);
      });
    }
    if (esBtn) {
      esBtn.setAttribute('href', '/index-es.html');           // safe fallback
      esBtn.addEventListener('click', function (e) {
        e.preventDefault();
        location.href = '/' + toES(file);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', wire);
})();
