/* menu.js — навигация + язык + раздел "Статистика" для UXNTWWW.io */
(function () {
  'use strict';

  function currentPage() {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p.replace('.html', '') || 'index';
  }

  const PAGE = currentPage();

  // ===== Строим навигацию =====
  function buildNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    nav.innerHTML = '';

    if (PAGE !== 'index') {
      const home = document.createElement('a');
      home.href = 'index.html';
      home.className = 'nav-btn';
      home.setAttribute('data-i18n', 'nav.home');
      home.textContent = 'Главная';
      nav.appendChild(home);
    }

    // ===== Помощь =====
    const helpWrap = document.createElement('div');
    helpWrap.className = 'nav-help-wrap';

    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'nav-btn nav-help-btn';
    helpBtn.innerHTML = '<span data-i18n="nav.help">Помощь</span> <span class="nav-arrow">▾</span>';
    helpWrap.appendChild(helpBtn);

    const helpMenu = document.createElement('div');
    helpMenu.className = 'nav-help-menu';
    helpMenu.innerHTML =
      '<a href="faq.html" data-i18n="nav.help.faq">FAQ</a>' +
      '<a href="contacts.html" data-i18n="nav.help.contacts">Контакты</a>' +
      '<a href="about.html" data-i18n="nav.help.about">О сайте</a>' +
      '<a href="install.html" data-i18n="nav.help.install">Установка</a>';
    helpWrap.appendChild(helpMenu);

    nav.appendChild(helpWrap);

    // ===== Статистика (как выпадашка) =====
    const statsWrap = document.createElement('div');
    statsWrap.className = 'nav-help-wrap';

    const statsBtn = document.createElement('button');
    statsBtn.type = 'button';
    statsBtn.className = 'nav-btn nav-help-btn';
    statsBtn.innerHTML = '<span data-i18n="nav.stats">Статистика</span> <span class="nav-arrow">▾</span>';
    statsWrap.appendChild(statsBtn);

    const statsMenu = document.createElement('div');
    statsMenu.className = 'nav-help-menu';
    statsMenu.innerHTML =
      '<a href="stats.html" data-i18n="stats.title">Статистика</a>';
    statsWrap.appendChild(statsMenu);

    nav.appendChild(statsWrap);

    // ===== Настройки =====
    const settings = document.createElement('a');
    settings.href = 'GlobalSettings.html';
    settings.className = 'nav-btn';
    settings.setAttribute('data-i18n', 'nav.settings');
    settings.textContent = 'Настройки';
    nav.appendChild(settings);

    // ===== Логика открытия/закрытия =====
    function setupToggle(wrap, btn) {
      let open = false;

      function openMenu() {
        // Закрываем другие открытые
        document.querySelectorAll('.nav-help-wrap.open').forEach(function (w) {
          if (w !== wrap) w.classList.remove('open');
        });
        open = true;
        wrap.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
      function closeMenu() {
        open = false;
        wrap.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (open) closeMenu();
        else openMenu();
      });

      document.addEventListener('click', function (e) {
        if (open && !wrap.contains(e.target)) closeMenu();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && open) closeMenu();
      });

      wrap.querySelectorAll('.nav-help-menu a').forEach(function (a) {
        a.addEventListener('click', function () { closeMenu(); });
      });
    }

    setupToggle(helpWrap, helpBtn);
    setupToggle(statsWrap, statsBtn);
  }

  function init() {
    buildNav();
    // Переводим навигацию после построения
    if (window.Lang && window.Lang.apply) {
      window.Lang.apply();
    }
  }

  // Слушаем смену языка — пересобрать навигацию
  document.addEventListener('langChanged', function () {
    if (window.Lang && window.Lang.apply) window.Lang.apply();
  });
  document.addEventListener('langReady', function () {
    if (window.Lang && window.Lang.apply) window.Lang.apply();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
