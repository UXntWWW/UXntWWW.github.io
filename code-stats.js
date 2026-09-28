/* code-stats.js — точный подсчёт строк кода проекта через GitHub API */
(function () {
  'use strict';

  const GITHUB_OWNER = 'UXntWWW';
  const GITHUB_REPO = 'UXntWWW.github.io';
  const CACHE_KEY = 'codeStatsCache_v1';
  const CACHE_TTL = 60 * 60 * 1000;

  const LANG_MAP = {
    '.html': { name: 'HTML', color: '#e34c26' },
    '.css':  { name: 'CSS', color: '#563d7c' },
    '.js':   { name: 'JavaScript', color: '#f1e05a' },
    '.json': { name: 'JSON', color: '#292929' }
  };

  function fileExt(path) {
    const i = path.lastIndexOf('.');
    return i === -1 ? '' : path.slice(i).toLowerCase();
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(r => r.ok ? r.text() : Promise.reject())
      .catch(() => null);
  }

  function getAllFiles() {
    return fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/git/trees/main?recursive=1', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => (data.tree || []).filter(item => item.type === 'blob'))
      .catch(() => []);
  }

  function countLines(url) {
    return fetchText(url).then(function (text) {
      if (!text) return 0;
      if (text.trim() === '') return 0;
      return text.split('\n').length;
    });
  }

  function calculate() {
    return getAllFiles().then(function (files) {
      var targets = files.filter(function (f) { return LANG_MAP[fileExt(f.path)]; });
      var byLang = {};
      var promises = targets.map(function (file) {
        var ext = fileExt(file.path);
        var lang = LANG_MAP[ext].name;
        var rawUrl = 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/main/' + file.path;
        return countLines(rawUrl).then(function (n) {
          if (!byLang[lang]) byLang[lang] = 0;
          byLang[lang] += n;
        });
      });
      return Promise.all(promises).then(function () {
        var total = 0;
        Object.keys(byLang).forEach(function (k) { total += byLang[k]; });
        return { byLang: byLang, total: total };
      });
    });
  }

  function render(data) {
    var totalEl = document.getElementById('code-total');
    var barsEl = document.getElementById('code-bars');
    if (totalEl) {
      totalEl.textContent = data.total.toLocaleString('ru-RU');
      totalEl.classList.remove('loading');
    }
    if (!barsEl) return;

    var entries = Object.keys(data.byLang)
      .map(function (lang) { return { lang: lang, lines: data.byLang[lang] }; })
      .sort(function (a, b) { return b.lines - a.lines; });

    barsEl.innerHTML = '';

    entries.forEach(function (entry, i) {
      var percent = data.total > 0 ? (entry.lines / data.total * 100) : 0;
      var color = '#888';
      Object.keys(LANG_MAP).forEach(function (ext) {
        if (LANG_MAP[ext].name === entry.lang) color = LANG_MAP[ext].color;
      });

      var row = document.createElement('div');
      row.className = 'code-row';
      row.style.animationDelay = (i * 0.1) + 's';
      row.innerHTML =
        '<div class="code-row-head">' +
          '<span class="code-dot" style="background:' + color + '"></span>' +
          '<span class="code-lang">' + entry.lang + '</span>' +
          '<span class="code-lines">' + entry.lines.toLocaleString('ru-RU') + '</span>' +
          '<span class="code-percent">' + percent.toFixed(1) + '%</span>' +
        '</div>' +
        '<div class="code-bar-track">' +
          '<div class="code-bar-fill" style="background:' + color + '; width:0%"></div>' +
        '</div>';
      barsEl.appendChild(row);
      setTimeout(function () {
        var fill = row.querySelector('.code-bar-fill');
        if (fill) fill.style.width = percent.toFixed(1) + '%';
      }, 100 + i * 100);
    });
  }

  function load() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && (Date.now() - cached.time < CACHE_TTL)) {
        render(cached.data);
        return;
      }
    } catch (e) {}

    calculate().then(function (data) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: data }));
      } catch (e) {}
      render(data);
    }).catch(function () {
      var totalEl = document.getElementById('code-total');
      if (totalEl) { totalEl.textContent = '—'; totalEl.classList.remove('loading'); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
