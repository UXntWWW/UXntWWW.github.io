/* menu.js — навигация + язык + раздел "Статистика" для UXNTWWW.io */
(function () {
  'use strict';

  function currentPage() {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p.replace('.html', '') || 'index';
  }

  const PAGE = currentPage();

  function t(key, fallback) {
    if (window.Lang && window.Lang.t) {
      var v = window.Lang.t(key);
      if (v && v !== key) return v;
    }
    return fallback || key;
  }

  function buildNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    nav.innerHTML = '';

    if (PAGE !== 'index') {
      const home = document.createElement('a');
      home.href = 'index.html';
      home.className = 'nav-btn';
      home.setAttribute('data-i18n', 'nav.home');
      home.textContent = t('nav.home', 'Главная');
      nav.appendChild(home);
    }

    // ===== Помощь =====
    const helpWrap = document.createElement('div');
    helpWrap.className = 'nav-help-wrap';

    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'nav-btn nav-help-btn';
    helpBtn.innerHTML = '<span data-i18n="nav.help">' + t('nav.help', 'Помощь') + '</span> <span class="nav-arrow">▾</span>';
    helpWrap.appendChild(helpBtn);

    const helpMenu = document.createElement('div');
    helpMenu.className = 'nav-help-menu';
    helpMenu.innerHTML =
      '<a href="faq.html" data-i18n="nav.help.faq">' + t('nav.help.faq', 'FAQ') + '</a>' +
      '<a href="contacts.html" data-i18n="nav.help.contacts">' + t('nav.help.contacts', 'Контакты') + '</a>' +
      '<a href="about.html" data-i18n="nav.help.about">' + t('nav.help.about', 'О сайте') + '</a>' +
      '<a href="install.html" data-i18n="nav.help.install">' + t('nav.help.install', 'Установка') + '</a>';
    helpWrap.appendChild(helpMenu);
    nav.appendChild(helpWrap);

    // ===== Статистика =====
    const statsWrap = document.createElement('div');
    statsWrap.className = 'nav-help-wrap';

    const statsBtn = document.createElement('button');
    statsBtn.type = 'button';
    statsBtn.className = 'nav-btn nav-help-btn';
    statsBtn.innerHTML = '<span data-i18n="nav.stats">' + t('nav.stats', 'Статистика') + '</span> <span class="nav-arrow">▾</span>';
    statsWrap.appendChild(statsBtn);

    const statsMenu = document.createElement('div');
    statsMenu.className = 'nav-help-menu';
    statsMenu.innerHTML =
      '<a href="stats.html" data-i18n="nav.stats">' + t('nav.stats', 'Статистика') + '</a>';
    statsWrap.appendChild(statsMenu);
    nav.appendChild(statsWrap);

    // ===== Настройки =====
    const settings = document.createElement('a');
    settings.href = 'GlobalSettings.html';
    settings.className = 'nav-btn';
    settings.setAttribute('data-i18n', 'nav.settings');
    settings.textContent = t('nav.settings', 'Настройки');
    nav.appendChild(settings);

    // ===== Тогглы =====
    function setupToggle(wrap, btn) {
      let open = false;

      function openMenu() {
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

  function refreshTexts() {
    // Обновляем все тексты внутри .top-nav
    document.querySelectorAll('.top-nav [data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (window.Lang && window.Lang.t) {
        var v = window.Lang.t(key);
        if (v && v !== key) el.textContent = v;
      }
    });
  }

  function init() {
    buildNav();
  }

  document.addEventListener('langChanged', refreshTexts);
  document.addEventListener('langReady', refreshTexts);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
