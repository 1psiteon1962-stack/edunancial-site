/* header.js v7 — bilingual toggle, maps EN<->ES counterparts and falls back safely */
(function(){
  const EN_TO_ES={
    "index.html":"es-our-story.html",
    "memberships-en.html":"memberships-es.html",
    "catalog.html":"es-catalog.html",
    "videos.html":"es-videos.html",
    "contact.html":"es-contact.html",
    "refunds.html":"es-refunds.html",
    "privacy.html":"es-privacy.html",
    "terms-of-service.html":"es-terms-of-service.html",
    "strategy-call.html":"pro-sesion.html"
  };
  const ES_TO_EN={
    "es-our-story.html":"index.html",
    "memberships-es.html":"memberships-en.html",
    "es-catalog.html":"catalog.html",
    "es-videos.html":"videos.html",
    "es-contact.html":"contact.html",
    "es-refunds.html":"refunds.html",
    "es-privacy.html":"privacy.html",
    "es-terms-of-service.html":"terms-of-service.html",
    "pro-sesion.html":"strategy-call.html"
  };
  function file(){const f=location.pathname.split('/').pop();return f||"index.html";}
  function go(e,target){e.preventDefault();location.href="/"+target;}
  document.addEventListener('DOMContentLoaded',()=>{
    const f=file(), en=document.getElementById('langEN'), es=document.getElementById('langES');
    if(en) en.addEventListener('click',e=>go(e,(ES_TO_EN[f]||"index.html")));
    if(es) es.addEventListener('click',e=>go(e,(EN_TO_ES[f]||"es-our-story.html")));
  });
})();
