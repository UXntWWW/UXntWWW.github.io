/* auto-update.js — автообновление данных раз в час (если включено) */
(function () {
  'use strict';

  if (localStorage.getItem('uiAutoUpdate') !== 'on') return;

  var INTERVAL = 60 * 60 * 1000; // 1 час
  var LAST_KEY = 'lastAutoUpdate';

  function doUpdate() {
    // Обновляем счётчики скачиваний (на главной)
    document.querySelectorAll('.program-card-downloads').forEach(function (el) {
      var owner = el.dataset.owner;
      var repo = el.dataset.repo;
      if (!owner || !repo) return;

      fetch('https://api.github.com/repos/' + owner + '/' + repo + '/releases', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (releases) {
          var total = 0;
          releases.forEach(function (rel) {
            (rel.assets || []).forEach(function (a) { total += a.download_count || 0; });
          });
          el.textContent = total > 0 ? total.toLocaleString('ru-RU') : '—';
        })
        .catch(function () {});
    });

    // Если на странице статистики — обновляем её данные
    if (typeof window.loadStats === 'function') window.loadStats();

    localStorage.setItem(LAST_KEY, String(Date.now()));
  }

  function check() {
    var last = parseInt(localStorage.getItem(LAST_KEY) || '0', 10);
    if (Date.now() - last >= INTERVAL) {
      doUpdate();
    }
  }

  // Запускаем при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }

  // И раз в час
  setInterval(doUpdate, INTERVAL);
})();
