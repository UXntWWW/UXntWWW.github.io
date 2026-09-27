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

    // Главная — только не на главной
    if (PAGE !== 'index') {
      const home = document.createElement('a');
      home.href = 'index.html';
      home.className = 'nav-btn';
      home.textContent = 'Главная';
      nav.appendChild(home);
    }

    // Помощь
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

    // Настройки
    const settings = document.createElement('a');
    settings.href = 'GlobalSettings.html';
    settings.className = 'nav-btn';
    settings.textContent = 'Настройки';
    nav.appendChild(settings);

    // Логика открытия/закрытия "Помощь"
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

    // Восстанавливаем состояние меню
    if (localStorage.getItem('helpMenuOpen') === 'on') {
      openMenu();
    }

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

  // ===== Кнопка "Свернуть/Развернуть шапку" =====
  function buildToggleButton() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'topbar-toggle';
    btn.setAttribute('aria-label', 'Свернуть шапку');
    btn.innerHTML = '<span class="toggle-arrow">▲</span>';
    document.body.appendChild(btn);

    let lastY = window.scrollY;
    let collapsed = false;

    function setCollapsed(state) {
      collapsed = state;
      document.body.classList.toggle('topbar-collapsed', state);
      const arrow = btn.querySelector('.toggle-arrow');
      if (arrow) arrow.textContent = state ? '▼' : '▲';
      btn.setAttribute('aria-label', state ? 'Развернуть шапку' : 'Свернуть шапку');
    }

    // Восстанавливаем состояние из localStorage
    const savedCollapsed = localStorage.getItem('topbarCollapsed') === 'on';
    if (savedCollapsed) setCollapsed(true);

    // Клик по кнопке
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setCollapsed(!collapsed);
      localStorage.setItem('topbarCollapsed', collapsed ? 'on' : 'off');
    });

    // Автосвёртывание при прокрутке вниз / авторазворот при прокрутке вверх
    window.addEventListener('scroll', function () {
      if (localStorage.getItem('topbarCollapsed') === 'on') return;

      const y = window.scrollY;
      if (y > lastY && y > 80 && !collapsed) {
        setCollapsed(true);
      } else if (y < lastY - 5 && collapsed) {
        setCollapsed(false);
      }
      lastY = y;
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildNav();
      buildToggleButton();
    });
  } else {
    buildNav();
    buildToggleButton();
  }
})();
