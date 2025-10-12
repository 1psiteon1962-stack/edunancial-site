// /js/header.js — language toggle that maps to the same page in the other language
(function () {
  function fileOnly() {
    const f = location.pathname.split('/').pop();
    return f && f.length ? f : 'index.html';
  }
  function toES(file) {
    if (file === 'index.html') return 'index-es.html';
    if (file === 'memberships-en.html') return 'memberships-es.html';
    if (file === 'catalog.html') return 'es-catalog.html';
    if (file === 'videos.html')  return 'es-videos.html';
    if (file === 'contact.html') return 'es-contact.html';
    if (/^es-/.test(file) || /-es\.html$/.test(file)) return file; // already ES
    return 'es-' + file;
  }
  function toEN(file) {
    if (file === 'index-es.html') return 'index.html';
    if (file === 'memberships-es.html') return 'memberships-en.html';
    if (file === 'es-catalog.html') return 'catalog.html';
    if (file === 'es-videos.html')  return 'videos.html';
    if (file === 'es-contact.html') return 'contact.html';
    return file.replace(/^es-/, '');
  }
  function wire() {
    const file = fileOnly();
    const enBtn = document.getElementById('langEN');
    const esBtn = document.getElementById('langES');
    if (enBtn) { enBtn.addEventListener('click', e => { e.preventDefault(); location.href = '/' + toEN(file); }); }
    if (esBtn) { esBtn.addEventListener('click', e => { e.preventDefault(); location.href = '/' + toES(file); }); }
  }
  document.addEventListener('DOMContentLoaded', wire);
})();
