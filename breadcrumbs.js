/* breadcrumbs.js — хлебные крошки на страницах */
(function () {
  'use strict';

  function t(key, fallback) {
    if (window.Lang && window.Lang.t) {
      var v = window.Lang.t(key);
      if (v && v !== key) return v;
    }
    return fallback || key;
  }

  function getTrail() {
    var p = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');

    var home = t('breadcrumbs.home', t('nav.home', 'Главная'));

    var map = {
      'index':    [{ name: home, href: 'index.html' }],
      'files':    [{ name: home, href: 'index.html' }, { name: 'PCCleaner', href: 'files.html' }],
      'files1':   [{ name: home, href: 'index.html' }, { name: 'UXWEditor', href: 'files1.html' }],
      'about':    [{ name: home, href: 'index.html' }, { name: t('nav.help.about', 'О сайте'), href: 'about.html' }],
      'contacts': [{ name: home, href: 'index.html' }, { name: t('nav.help.contacts', 'Контакты'), href: 'contacts.html' }],
      'faq':      [{ name: home, href: 'index.html' }, { name: 'FAQ', href: 'faq.html' }],
      'GlobalSettings': [{ name: home, href: 'index.html' }, { name: t('nav.settings', 'Настройки'), href: 'GlobalSettings.html' }],
      'stats':    [{ name: home, href: 'index.html' }, { name: t('nav.stats', 'Статистика'), href: 'stats.html' }],
      'install':  [{ name: home, href: 'index.html' }, { name: t('nav.help.install', 'Установка'), href: 'install.html' }]
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
