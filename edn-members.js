<script>
document.addEventListener("DOMContentLoaded", ()=>{
  const el = document.getElementById("edn-members-actions");
  if(!el) return;
  el.addEventListener("click", e=>{
    const t = e.target.closest("[data-action]");
    if(!t) return;
    const a = t.getAttribute("data-action");
    if(a==="basic") location.href="videos.html#free";
    if(a==="gold")  location.href="videos.html#member";
  });
});
</script>
