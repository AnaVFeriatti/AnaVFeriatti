'use strict';

initLayout();
initTheme();
initI18n();
initMenu();
initReveal();
initRepos();
initCerts();
initContactLinks();

function initContactLinks() {
  const linkedin = document.getElementById('ciLinkedin');
  const github = document.getElementById('ciGithub');

  if (linkedin) linkedin.href = CONFIG.social.linkedin;
  if (github) github.href = `https://github.com/${CONFIG.github.username}`;
}
