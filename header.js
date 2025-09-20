<script>
(function(){
  const map = {
    "index.html":"es-index.html",
    "books.html":"es-books.html",
    "courses.html":"es-courses.html",
    "payments.html":"es-payments.html",
    "contact.html":"es-contact.html",
    "privacy.html":"es-privacy.html",
    "terms.html":"es-terms.html",
    "refunds.html":"es-refunds.html",
    "our-story.html":"es-our-story.html",
    "checkout.html":"es-checkout.html",
    "mini-courses.html":"es-mini-courses.html"
  };

  function currentFile(){
    const p = location.pathname.split("/").filter(Boolean);
    return p.length? p[p.length-1] : "index.html";
  }
  const file = currentFile();
  const isES = /^es-/.test(file);

  // Helpers
  const counterpart = isES ? file.replace(/^es-/,'') : (map[file] || file);

  // Build header
  const header = document.createElement('div');
  header.id = 'edn-header';
  header.innerHTML = `
    <div class="bar">
      <div class="brand">EDUNANCIAL</div>
      <nav id="edn-nav">
        <a href="/index.html">Home</a>
        <a href="/books.html">Books</a>
        <a href="/courses.html">Courses</a>
        <a href="/payments.html">Payments</a>
        <a href="/contact.html">Contact</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/refunds.html">Refunds</a>
        <a href="/our-story.html">Our Story</a>
      </nav>
      <div class="lang-toggle" role="group" aria-label="Language toggle">
        <a href="/${counterpart}" class="${!isES?'active':''}">EN</a>
        <a href="/${isES?file:'/es-'+file}" class="${isES?'active':''}">ES</a>
      </div>
    </div>`;
  document.body.prepend(header);
})();
</script>
