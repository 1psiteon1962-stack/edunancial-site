<!-- /js/membership-gate.js -->
<script>
(function(){
  function isAdmin(){
    try{
      const t = localStorage.getItem("edn_admin_token");
      if(!t) return false;
      const [b64, sig] = t.split(".");
      if(!b64 || !sig) return false;
      const payload = JSON.parse(atob(b64));
      return payload && payload.role === "admin" && payload.exp*1000 > Date.now();
    }catch(_){ return false; }
  }
  // If not admin, this is where you’d normally check logged-in member status.
  // For now, only admin bypass is required for your testing flow.
  if(!isAdmin()){
    // Allow Our Story & Membership pages public
    const path = location.pathname.replace(/\/+$/, "");
    const publicPaths = ["", "/", "/index.html", "/our-story.html", "/membership.html", "/es-index.html", "/es-our-story.html", "/es-membership.html"];
    if (!publicPaths.includes(path)) {
      location.href = (document.documentElement.lang === "es" ? "/es-membership.html" : "/membership.html");
    }
  }
})();
</script>
