/* menu.js — выпадающее меню "Помощь" + навигация для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  // Какая страница сейчас открыта
  function currentPage() {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p.replace('.html', '') || 'index';
  }

  const PAGE = currentPage();

  // ===== Строим панель навигации =====
  function buildNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    // Очищаем старую навигацию
    nav.innerHTML = '';

    // Главная — только если мы НЕ на главной
    if (PAGE !== 'index') {
      const home = document.createElement('a');
      home.href = 'index.html';
      home.className = 'nav-btn';
      home.textContent = 'Главная';
      nav.appendChild(home);
    }

    // Помощь с выпадающим подменю
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

    // ===== Логика открытия/закрытия =====
    let open = false;

    function openMenu() {
      open = true;
      helpWrap.classList.add('open');
      helpBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      open = false;
      helpWrap.classList.remove('open');
      helpBtn.setAttribute('aria-expanded', 'false');
    }

    helpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open) closeMenu();
      else openMenu();
    });

    // Клик вне меню — закрыть
    document.addEventListener('click', function (e) {
      if (open && !helpWrap.contains(e.target)) closeMenu();
    });

    // Escape — закрыть
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) closeMenu();
    });

    // Клик по ссылке внутри — закрыть (но переход всё равно произойдёт)
    helpMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu();
        // Плавное закрытие до перехода
        // (браузер всё равно перейдёт — анимация закроется сама)
      });
    });
  }

  // Запуск после DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
