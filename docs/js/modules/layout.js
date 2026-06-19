'use strict';

function initLayout() {
  const page = document.body.dataset.page || '';

  const nav = [
    { href: 'index.html', label: 'Início', id: 'home', i18n: 'nav.home' },
    { href: 'sobre.html', label: 'Sobre', id: 'sobre', i18n: 'nav.sobre' },
    { href: 'projetos.html', label: 'Projetos', id: 'projetos', i18n: 'nav.projetos' },
    { href: 'certificados.html', label: 'Certificados', id: 'certificados', i18n: 'nav.certificados' },
    { href: 'contato.html', label: 'Contato', id: 'contato', i18n: 'nav.contato' },
  ];

  const navLinks = nav.map((n) => {
    const active = n.id === page;
    return `<a href="${n.href}" data-i18n="${n.i18n}"${active ? ' class="active" aria-current="page"' : ''}>${n.label}</a>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'navbar';
  header.setAttribute('role', 'banner');
  header.innerHTML = `
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
      <a href="index.html" class="nav-brand"><span>Ana</span> Feriatti</a>
      <nav class="nav-links" aria-label="Navegação principal">${navLinks}</nav>
      <div class="nav-actions">
        <button id="langBtn" class="nav-btn" onclick="toggleLang()" aria-label="Trocar idioma">EN</button>
        <button id="themeBtn" class="nav-btn" onclick="toggleTheme()" aria-label="Trocar tema">🌙</button>
        <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="sideNav" aria-label="Abrir menu">☰</button>
      </div>
    </div>`;

  const sideNav = document.createElement('nav');
  sideNav.className = 'side-nav';
  sideNav.id = 'sideNav';
  sideNav.setAttribute('aria-label', 'Menu mobile');
  sideNav.innerHTML = navLinks;

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.setAttribute('role', 'contentinfo');
  footer.innerHTML = `<p>Feito com 💜 por <a href="https://github.com/AnaVFeriatti" target="_blank" rel="noopener">Ana Feriatti</a> · ${new Date().getFullYear()}</p>`;

  document.body.prepend(sideNav);
  document.body.prepend(header);
  document.body.appendChild(footer);
}
