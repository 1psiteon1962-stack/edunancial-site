// House ad placeholder (replace with your ad network tag later)
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.ad-slot[data-ad="house"]').forEach(slot=>{
    slot.innerHTML = '<div style="padding:12px;border:1px dashed #999;border-radius:8px;background:#fff">Ad space — contact <a href="mailto:ads@edunancial.com">ads@edunancial.com</a></div>';
  });
});
