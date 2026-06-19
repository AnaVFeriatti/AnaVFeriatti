'use strict';

const LANG_COLORS = Object.freeze({
  'C#': '#239120', Python: '#3572A5', JavaScript: '#f1e05a',
  TypeScript: '#2b7489', Go: '#00ADD8', C: '#555', 'C++': '#f34b7d',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', PHP: '#4F5D95',
  Java: '#b07219', Jupyter: '#DA5B0B', R: '#198CE7',
});

const CACHE_KEY = 'gh_repos';
const CACHE_TTL = 5 * 60 * 1000;

function initRepos() {
  const list = document.getElementById('repoList');
  if (!list) return;

  const username = CONFIG.github.username;
  const loading = document.getElementById('loadingRepos');
  const error = document.getElementById('errorRepos');
  const filtersEl = document.getElementById('projectFilters');
  const countEl = document.getElementById('projectCount');
  const featuredSet = new Set(CONFIG.github.featuredRepos.map((n) => n.toLowerCase()));

  let allRepos = [];
  let activeFilter = 'all';

  function renderFilters(repos) {
    if (!filtersEl) return;
    const langs = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();
    const btns = langs.map((l) => `<button class="filter-btn" data-lang="${l}">${l}</button>`).join('');
    filtersEl.innerHTML = `<button class="filter-btn active" data-lang="all">Todos</button>${btns}`;
    filtersEl.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.lang;
        renderList();
      });
    });
  }

  function renderList() {
    const filtered = activeFilter === 'all' ? allRepos : allRepos.filter((r) => r.language === activeFilter);
    if (countEl) countEl.textContent = `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
    list.innerHTML = filtered.map((repo) => renderRepo(repo, featuredSet)).join('');
  }

  getRepos(username)
    .then((repos) => {
      if (loading) loading.style.display = 'none';
      if (!repos.length) {
        showError(error, 'Nenhum repositório encontrado.');
        return;
      }
      repos.sort((a, b) => {
        const af = featuredSet.has(a.name.toLowerCase()) ? 1 : 0;
        const bf = featuredSet.has(b.name.toLowerCase()) ? 1 : 0;
        if (af !== bf) return bf - af;
        return new Date(b.pushed_at) - new Date(a.pushed_at);
      });
      allRepos = repos;
      renderFilters(repos);
      renderList();
    })
    .catch(() => {
      if (loading) loading.style.display = 'none';
      showError(error, 'Não foi possível carregar os projetos. Tente novamente mais tarde.');
    });
}

async function getRepos(username) {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch (_) {}

  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch (_) {}

  return data;
}

function renderRepo(repo, featuredSet) {
  const isFeatured = featuredSet.has(repo.name.toLowerCase());
  const lang = repo.language || '';
  const langColor = LANG_COLORS[lang] || '#9b59b6';
  const date = repo.pushed_at.slice(0, 10).split('-').reverse().join('/');

  return `
    <article class="card project-card${isFeatured ? ' featured' : ''}">
      <div class="card-title"><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a></div>
      ${repo.description ? `<p class="card-desc">${escapeHtml(repo.description)}</p>` : '<p class="card-desc" style="opacity:0.5">Sem descrição</p>'}
      <div class="project-meta">
        ${lang ? `<span><span class="lang-dot" style="background:${langColor}"></span>${lang}</span>` : ''}
        ${repo.stargazers_count ? `<span>⭐ ${repo.stargazers_count}</span>` : ''}
        <span>📅 ${date}</span>
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" rel="noopener">Repositório</a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener">Demo</a>` : ''}
      </div>
    </article>`;
}

function showError(el, html) {
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML = html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
