<script>
/* ===== Simple site-wide cart ===== */
const CART_KEY = "edn_cart_v1";
function readCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||{items:[]};}catch{return{items:[]};} }
function writeCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
function addToCart(item){
  const c = readCart();
  const i = c.items.findIndex(x=>x.id===item.id && (x.variant||"default")===(item.variant||"default"));
  if(i>-1) c.items[i].quantity += item.quantity; else c.items.push(item);
  writeCart(c);
}
function setQty(id,v,q){ const c=readCart(); const i=c.items.findIndex(x=>x.id===id&&(x.variant||"default")===(v||"default")); if(i>-1){ c.items[i].quantity=Math.max(1,q|0); writeCart(c);} }
function removeItem(id,v){ const c=readCart(); c.items=c.items.filter(x=>!(x.id===id&&(x.variant||"default")===(v||"default"))); writeCart(c); }
function clearCart(){ writeCart({items:[]}); }
function updateCartBadge(){ const el=document.getElementById("cart-badge"); if(!el) return; const n=readCart().items.reduce((a,i)=>a+i.quantity,0); el.textContent=n; }
document.addEventListener("DOMContentLoaded", updateCartBadge);

/* ===== Attach to any button with data-add-to-cart ===== */
document.addEventListener("click", (e)=>{
  const btn=e.target.closest("[data-add-to-cart]"); if(!btn) return;
  e.preventDefault();
  addToCart({
    id: btn.dataset.id,           // SKU
    name: btn.dataset.name,       // Display name
    variant: btn.dataset.variant || "default",
    price: parseFloat(btn.dataset.price),
    quantity: parseInt(btn.dataset.qty||"1",10) || 1
  });
  const old=btn.textContent; btn.textContent=btn.dataset.added||"Added ✓";
  setTimeout(()=>btn.textContent=(btn.dataset.label||old||"Add to Cart"),1200);
});
</script>
