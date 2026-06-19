'use strict';

function initCerts() {
  const list = document.getElementById('certList');
  if (!list) return;

  const countEl = document.getElementById('certCount');
  let activeFilter = 'all';

  function render(filter) {
    const filtered = filter === 'all' ? CERTS_DATA : CERTS_DATA.filter((c) => c.category === filter);
    if (countEl) countEl.textContent = `${filtered.length} certificado${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
    list.innerHTML = filtered.map((cert) => `
      <article class="card cert-card reveal visible">
        <div class="card-title">${cert.title}</div>
        <div class="cert-issuer">${cert.issuer}</div>
        <div class="cert-date">${cert.date}</div>
        <span class="cert-category">${cert.category}</span>
        ${cert.url ? `<a href="${cert.url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:var(--space-sm);font-size:0.85rem;">Ver certificado →</a>` : ''}
      </article>`).join('');
  }

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render(activeFilter);
    });
  });

  render(activeFilter);
}
