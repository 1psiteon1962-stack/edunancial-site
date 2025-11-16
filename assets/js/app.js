// assets/js/app.js

// 1. language toggle
(function () {
  const enBtn = document.getElementById("btn-en");
  const esBtn = document.getElementById("btn-es");

  function setLang(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    // button states
    if (lang === "en") {
      enBtn?.classList.add("active");
      esBtn?.classList.remove("active");
    } else {
      esBtn?.classList.add("active");
      enBtn?.classList.remove("active");
    }
    // remember choice
    try {
      localStorage.setItem("edunancial-lang", lang);
    } catch {}
  }

  if (enBtn && esBtn) {
    enBtn.addEventListener("click", () => setLang("en"));
    esBtn.addEventListener("click", () => setLang("es"));
  }

  // load saved lang
  let saved = "en";
  try {
    saved = localStorage.getItem("edunancial-lang") || "en";
  } catch {}
  setLang(saved);
})();

// 2. fix links like href="/our-story.html" -> "our-story.html"
(function () {
  const links = document.querySelectorAll("a[href^='/']");
  links.forEach((a) => {
    const clean = a.getAttribute("href").replace(/^\//, "");
    a.setAttribute("href", clean);
  });
})();
