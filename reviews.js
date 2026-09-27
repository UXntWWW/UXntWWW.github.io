/* reviews.js — отзывы и рейтинг для страниц UXNTWWW.io */
(function () {
  'use strict';

  // ===== НАСТРОЙКИ =====
  const GISCUS_REPO        = 'UXntWWW/UXntWWW.github.io';
  const GISCUS_REPO_ID     = 'R_kgDOTZJ_lQ';
  const GISCUS_CATEGORY    = 'Отзывы';
  const GISCUS_CATEGORY_ID = 'DIC_kwDOTZJ_lc4DGhXU';
  const GITHUB_TOKEN       = '';
  const RATING_PREFIX      = 'RATING:';

  function getSlug() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace('.html', '');
  }

  const SLUG = getSlug();

  // ===== Определяем тему для Giscus по настройкам сайта =====
  function getGiscusTheme() {
    const glass = localStorage.getItem('glassEffect') === 'on';
    const mode = localStorage.getItem('themeMode') || 'presets';

    if (glass) {
      return 'transparent_dark';
    }

    if (mode === 'presets') {
      const preset = localStorage.getItem('presetName') || 'base';
      if (preset === 'dark') return 'dark';
      if (preset === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }

    // Кастом — определяем по яркости фона
    const bg = localStorage.getItem('colorBg') || '#ffffff';
    const r = parseInt(bg.substr(1, 2), 16);
    const g = parseInt(bg.substr(3, 2), 16);
    const b = parseInt(bg.substr(5, 2), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum < 0.5 ? 'dark' : 'light';
  }

  function createReviewsSection() {
    const section = document.createElement('section');
    section.className = 'reviews-section';
    section.innerHTML =
      '<h2 class="reviews-title">Отзывы и рейтинг</h2>' +
      '<p class="reviews-subtitle">Оценки — от 1 до 5 звёзд. Чтобы оставить отзыв, напиши его в комментариях ниже (нужен GitHub-аккаунт).</p>' +
      '<div class="rating-summary" id="rating-summary">' +
        '<div class="rating-stars-display" id="rating-stars-display">☆☆☆☆☆</div>' +
        '<div class="rating-value" id="rating-value">—</div>' +
        '<div class="rating-count" id="rating-count">оценок пока нет</div>' +
      '</div>' +
      '<button class="write-review-btn" id="write-review-btn">★ Оценить программу</button>' +
      '<div class="reviews-list" id="reviews-list"></div>' +
      '<div class="giscus-wrap" id="giscus-wrap"></div>';

    const content = document.querySelector('.content') || document.body;
    content.appendChild(section);
  }

  function createRatingModal() {
    const modal = document.createElement('div');
    modal.className = 'rating-modal-backdrop';
    modal.id = 'rating-modal';
    modal.innerHTML =
      '<div class="rating-modal">' +
        '<h3>Оцените программу</h3>' +
        '<p>Поставьте от 1 до 5 звёзд.</p>' +
        '<div class="rating-stars-input" id="rating-stars-input">' +
          '<span data-value="1">★</span>' +
          '<span data-value="2">★</span>' +
          '<span data-value="3">★</span>' +
          '<span data-value="4">★</span>' +
          '<span data-value="5">★</span>' +
        '</div>' +
        '<div class="rating-modal-actions">' +
          '<button id="rating-cancel">Отмена</button>' +
          '<button id="rating-save" disabled>Сохранить</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    let chosen = 0;
    const stars = modal.querySelectorAll('#rating-stars-input span');
    const saveBtn = modal.querySelector('#rating-save');

    stars.forEach(function (s) {
      s.addEventListener('mouseenter', function () {
        const v = parseInt(s.dataset.value, 10);
        stars.forEach(function (x) {
          x.classList.toggle('active', parseInt(x.dataset.value, 10) <= v);
        });
      });
      s.addEventListener('click', function () {
        chosen = parseInt(s.dataset.value, 10);
        stars.forEach(function (x) {
          x.classList.toggle('active', parseInt(x.dataset.value, 10) <= chosen);
        });
        saveBtn.disabled = false;
      });
    });

    modal.querySelector('#rating-stars-input').addEventListener('mouseleave', function () {
      stars.forEach(function (x) {
        x.classList.toggle('active', parseInt(x.dataset.value, 10) <= chosen);
      });
    });

    modal.querySelector('#rating-cancel').addEventListener('click', function () {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('show');
    });

    saveBtn.addEventListener('click', function () {
      if (!chosen) return;
      const key = 'rating_' + SLUG;
      localStorage.setItem(key, String(chosen));
      updateRatingFromLocal();
      modal.classList.remove('show');
    });
  }

  function updateRatingFromLocal() {
    const key = 'rating_' + SLUG;
    const v = parseInt(localStorage.getItem(key) || '0', 10);
    if (v >= 1 && v <= 5) renderRating([v]);
    else renderRating([]);
  }

  function renderRating(values) {
    const starsEl = document.getElementById('rating-stars-display');
    const valueEl = document.getElementById('rating-value');
    const countEl = document.getElementById('rating-count');
    if (!starsEl) return;

    if (!values.length) {
      starsEl.textContent = '☆☆☆☆☆';
      valueEl.textContent = '—';
      countEl.textContent = 'оценок пока нет';
      return;
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const rounded = Math.round(avg * 2) / 2;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rounded)) stars += '★';
      else stars += '☆';
    }
    starsEl.textContent = stars;
    valueEl.textContent = avg.toFixed(1);
    countEl.textContent = values.length + ' ' + plural(values.length, ['оценка', 'оценки', 'оценок']);
  }

  function plural(n, forms) {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }

  // ===== Giscus с синхронизацией темы =====
  let giscusLoaded = false;

  function loadGiscus() {
    const wrap = document.getElementById('giscus-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';

    const theme = getGiscusTheme();

    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', GISCUS_REPO);
    s.setAttribute('data-repo-id', GISCUS_REPO_ID);
    s.setAttribute('data-category', GISCUS_CATEGORY);
    s.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
    s.setAttribute('data-mapping', 'specific');
    s.setAttribute('data-term', SLUG);
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', theme);
    s.setAttribute('data-lang', 'ru');
    s.setAttribute('crossorigin', 'anonymous');
    s.async = true;
    wrap.appendChild(s);

    giscusLoaded = true;
  }

  // Обновление темы Giscus без перезагрузки страницы
  function updateGiscusTheme() {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    const theme = getGiscusTheme();
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme } } },
      'https://giscus.app'
    );
  }

  // Слушаем изменения темы на сайте (custom event из theme.js)
  document.addEventListener('themeChanged', function () {
    if (giscusLoaded) updateGiscusTheme();
  });

  // Запуск
  document.addEventListener('DOMContentLoaded', function () {
    createReviewsSection();
    createRatingModal();

    const btn = document.getElementById('write-review-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('rating-modal').classList.add('show');
      });
    }

    updateRatingFromLocal();
    loadGiscus();
  });
})();
