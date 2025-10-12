<script>
// Unified language toggle for single-language pages.
// Page pairs:
//   Home:          /index.html           <-> /index-es.html
//   Memberships:   /memberships-en.html  <-> /memberships-es.html
//   Our Story:     /our-story.html       <-> /es-our-story.html  (optional)
//   Catalog:       /catalog.html         <-> /es-catalog.html    (when added)

(function(){
  const mapSwap = (to) => {
    const p = location.pathname.replace(/\/+$/,'') || '/';

    // Home
    if (p === '/' || p.endsWith('/index.html')) return (to==='es')? '/index-es.html' : '/index.html';
    if (p.endsWith('/index-es.html'))            return (to==='es')? '/index-es.html' : '/index.html';

    // Memberships
    if (p.endsWith('/memberships-en.html'))      return (to==='es')? '/memberships-es.html' : '/memberships-en.html';
    if (p.endsWith('/memberships-es.html'))      return (to==='es')? '/memberships-es.html' : '/memberships-en.html';

    // Our Story (optional pair)
    if (p.endsWith('/our-story.html'))           return (to==='es')? '/es-our-story.html' : '/our-story.html';
    if (p.endsWith('/es-our-story.html'))        return (to==='es')? '/es-our-story.html' : '/our-story.html';

    // Catalog (optional ES)
    if (p.endsWith('/catalog.html'))             return (to==='es')? '/catalog.html' : '/catalog.html';
    if (p.endsWith('/es-catalog.html'))          return (to==='es')? '/es-catalog.html' : '/catalog.html';

    // Fallback to home
    return (to==='es')? '/index-es.html' : '/index.html';
  };

  function bind(){
    const en = document.querySelector('#btn-en');
    const es = document.querySelector('#btn-es');
    if (en) en.addEventListener('click', e => { e.preventDefault(); location.href = mapSwap('en'); });
    if (es) es.addEventListener('click', e => { e.preventDefault(); location.href = mapSwap('es'); });
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
</script>
