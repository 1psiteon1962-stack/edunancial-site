// /assets/js/vendorHub.js
document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.getElementById('vendorGrid');
  if (!grid) return;

  let vendors = [];
  try {
    const res = await fetch('/data/vendors.json');
    vendors = await res.json();
  } catch (e) {
    vendors = [];
  }

  function render(list) {
    grid.innerHTML = '';
    if (!list.length) {
      const div = document.createElement('div');
      div.textContent = 'No vendors found / No se encontraron proveedores.';
      grid.appendChild(div);
      return;
    }
    list.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vendor-card';
      card.innerHTML = `
        <h3>${v.name}</h3>
        <p><strong>${v.category}</strong></p>
        <p>${v.description}</p>
        <p><a href="mailto:${v.email}">${v.email}</a></p>
      `;
      grid.appendChild(card);
    });
  }

  render(vendors);

  const searchInput = document.getElementById('vendorSearch');
  const categorySelect = document.getElementById('vendorCategory');

  function filter() {
    const term = (searchInput && searchInput.value || '').toLowerCase();
    const cat = categorySelect && categorySelect.value || '';
    const filtered = vendors.filter(v => {
      const matchTerm =
        v.name.toLowerCase().includes(term) ||
        v.description.toLowerCase().includes(term);
      const matchCat = cat ? v.type === cat : true;
      return matchTerm && matchCat;
    });
    render(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filter);
  if (categorySelect) categorySelect.addEventListener('change', filter);
});
