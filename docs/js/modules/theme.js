'use strict';

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn && !themeBtn.onclick) {
    themeBtn.onclick = toggleTheme;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

window.toggleTheme = toggleTheme;