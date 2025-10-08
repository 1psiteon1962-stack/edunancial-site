<script>
(function(){
  const params = new URLSearchParams(location.search);
  const t = params.get('member_token');
  if (t) {
    // 180-day cookie
    const expires = new Date(Date.now() + 180*24*60*60*1000).toUTCString();
    document.cookie = `ed_member=${encodeURIComponent(t)}; expires=${expires}; path=/; SameSite=Lax`;
  }
})();
</script>
