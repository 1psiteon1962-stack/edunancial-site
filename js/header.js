/* header.js — bilingual toggle with safe fallbacks + query preservation */
(function () {
  const EN_TO_ES = {
    "index.html": "es-our-story.html",
    "memberships-en.html": "memberships-es.html",
    "catalog.html": "es-catalog.html",
    "videos.html": "es-videos.html",
    "contact.html": "es-contact.html",
    "refunds.html": "es-refunds.html",
    "privacy.html": "es-privacy.html",
    "terms-of-service.html": "es-terms-of-service.html",
    "paypal-live-test.html": "paypal-live-test.html",
    "paypal-live-subscriptions-test.html": "paypal-live-subscriptions-test.html",
    "paypal-return.html": "paypal-return.html",
    "404.html": "404-es.html"
  };
  const ES_TO_EN = {
    "es-our-story.html": "index.html",
    "memberships-es.html": "memberships-en.html",
    "es-catalog.html": "catalog.html",
    "es-videos.html": "videos.html",
    "es-contact.html": "contact.html",
    "es-refunds.html": "refunds.html",
    "es-privacy.html": "privacy.html",
    "es-terms-of-service.html": "terms-of-service.html",
    "404-es.html": "404.html"
  };
  function currentFile(){ const p=location.pathname.split("/").pop(); return p||"index.html"; }
  function qs(){ return (location.search||"")+(location.hash||""); }
  function go(e,target){ e.preventDefault(); location.href="/"+(target||"index.html")+qs(); }
  document.addEventListener("DOMContentLoaded",()=>{
    const f=currentFile(), en=document.getElementById("langEN"), es=document.getElementById("langES");
    if(en){ en.addEventListener("click",(e)=>go(e, ES_TO_EN[f]||"index.html")); }
    if(es){ es.addEventListener("click",(e)=>go(e, EN_TO_ES[f]||"es-our-story.html")); }
  });
})();
