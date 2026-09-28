/* breadcrumbs.js — хлебные крошки на страницах */
(function () {
  'use strict';

  function getTrail() {
    var p = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    var t = function (k, fallback) {
      if (window.Lang && window.Lang.t) {
        var v = window.Lang.t(k);
        if (v && v !== k) return v;
      }
      return fallback || k;
    };

    var map = {
      'index':    [{ name: t('nav.home', 'Главная'), href: 'index.html' }],
      'files':    [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: 'PCCleaner', href: 'files.html' }],
      'files1':   [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: 'UXWEditor', href: 'files1.html' }],
      'about':    [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: t('nav.help.about', 'О сайте'), href: 'about.html' }],
      'contacts': [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: t('nav.help.contacts', 'Контакты'), href: 'contacts.html' }],
      'faq':      [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: 'FAQ', href: 'faq.html' }],
      'GlobalSettings': [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                         { name: t('nav.settings', 'Настройки'), href: 'GlobalSettings.html' }],
      'stats':    [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: t('nav.stats', 'Статистика'), href: 'stats.html' }],
      'install':  [{ name: t('nav.home', 'Главная'), href: 'index.html' },
                   { name: t('nav.help.install', 'Установка'), href: 'install.html' }]
    };

    return map[p] || [];
  }

  function build() {
    var trail = getTrail();
    if (!trail.length) return;

    var content = document.querySelector('.content');
    if (!content) return;

    var old = document.querySelector('.breadcrumbs');
    if (old) old.remove();

    var bc = document.createElement('nav');
    bc.className = 'breadcrumbs';
    var html = '';

    trail.forEach(function (item, i) {
      if (i > 0) html += '<span class="bc-sep">›</span>';
      if (i === trail.length - 1) {
        html += '<span class="bc-current">' + item.name + '</span>';
      } else {
        html += '<a href="' + item.href + '">' + item.name + '</a>';
      }
    });

    bc.innerHTML = html;
    content.insertBefore(bc, content.firstChild);
  }

  document.addEventListener('langChanged', build);
  document.addEventListener('langReady', build);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
