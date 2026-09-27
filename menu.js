/* menu.js — навигация + свёртывание шапки для UXNTWWW.io */
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
      home.textContent = 'Главная';
      nav.appendChild(home);
    }

    const helpWrap = document.createElement('div');
    helpWrap.className = 'nav-help-wrap';

    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'nav-btn nav-help-btn';
    helpBtn.innerHTML = 'Помощь <span class="nav-arrow">▾</span>';
    helpWrap.appendChild(helpBtn);

    const helpMenu = document.createElement('div');
    helpMenu.className = 'nav-help-menu';
    helpMenu.innerHTML =
      '<a href="faq.html">FAQ</a>' +
      '<a href="contacts.html">Контакты</a>' +
      '<a href="about.html">О сайте</a>';
    helpWrap.appendChild(helpMenu);

    nav.appendChild(helpWrap);

    const settings = document.createElement('a');
    settings.href = 'GlobalSettings.html';
    settings.className = 'nav-btn';
    settings.textContent = 'Настройки';
    nav.appendChild(settings);

    let open = false;

    function openMenu() {
      open = true;
      helpWrap.classList.add('open');
      helpBtn.setAttribute('aria-expanded', 'true');
      localStorage.setItem('helpMenuOpen', 'on');
    }
    function closeMenu() {
      open = false;
      helpWrap.classList.remove('open');
      helpBtn.setAttribute('aria-expanded', 'false');
      localStorage.setItem('helpMenuOpen', 'off');
    }

    if (localStorage.getItem('helpMenuOpen') === 'on') openMenu();

    helpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', function (e) {
      if (open && !helpWrap.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) closeMenu();
    });

    helpMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(); });
    });
  }

  // ===== Компенсация высоты fixed-шапки =====
  function fixTopBarHeight() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    function update() {
      const h = topBar.offsetHeight;
      document.body.style.paddingTop = h + 'px';
      document.documentElement.style.setProperty('--topbar-height', h + 'px');
    }

    update();
    window.addEventListener('resize', update);
    setTimeout(update, 100);
    setTimeout(update, 400);
  }

  function init() {
    buildNav();
    fixTopBarHeight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
