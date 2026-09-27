/* reviews.js — отзывы и рейтинг для страниц UXNTWWW.io
   Использует GitHub Discussions через Giscus + GitHub API для рейтинга.
*/
(function () {
  'use strict';

  // ===== НАСТРОЙКИ =====
  const GISCUS_REPO        = 'UXntWWW/UXntWWW.github.io';
  const GISCUS_REPO_ID     = 'R_kgDOTZJ_lQ';
  const GISCUS_CATEGORY    = 'Отзывы';
  const GISCUS_CATEGORY_ID = 'DIC_kwDOTZJ_lc4DGhXU';
  const GITHUB_TOKEN       = '';                        // ← оставь пустым или вставь токен для общего рейтинга
  const RATING_PREFIX      = 'RATING:';

  function getSlug() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace('.html', '');
  }

  const SLUG = getSlug();

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
        '<p>Поставьте от 1 до 5 звёзд. Ваша оценка сохранится и будет учтена в общем рейтинге.</p>' +
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
      if (GITHUB_TOKEN) {
        postRatingToGitHub(chosen);
      } else {
        updateRatingFromLocal();
      }
      modal.classList.remove('show');
    });
  }

  function postRatingToGitHub(value) {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GITHUB_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query($owner: String!, $repo: String!, $title: String!) {
            repository(owner: $owner, name: $repo) {
              discussion(title: $title) { id }
            }
          }`,
        variables: {
          owner: GISCUS_REPO.split('/')[0],
          repo: GISCUS_REPO.split('/')[1],
          title: SLUG
        }
      })
    })
    .then(r => r.json())
    .then(function (data) {
      const discussionId = data && data.data && data.data.repository &&
                          data.data.repository.discussion &&
                          data.data.repository.discussion.id;
      if (!discussionId) return;
      return fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + GITHUB_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation($discussionId: ID!, $body: String!) {
              addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
                comment { id }
              }
            }`,
          variables: { discussionId: discussionId, body: RATING_PREFIX + value }
        })
      });
    })
    .then(function () { setTimeout(updateRatingFromGitHub, 1200); })
    .catch(function () { updateRatingFromLocal(); });
  }

  function updateRatingFromGitHub() {
    if (!GITHUB_TOKEN) { updateRatingFromLocal(); return; }

    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GITHUB_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query($owner: String!, $repo: String!, $title: String!) {
            repository(owner: $owner, name: $repo) {
              discussion(title: $title) {
                comments(first: 100) { nodes { body } }
              }
            }
          }`,
        variables: {
          owner: GISCUS_REPO.split('/')[0],
          repo: GISCUS_REPO.split('/')[1],
          title: SLUG
        }
      })
    })
    .then(r => r.json())
    .then(function (data) {
      const comments = data && data.data && data.data.repository &&
                       data.data.repository.discussion &&
                       data.data.repository.discussion.comments &&
                       data.data.repository.discussion.comments.nodes;
      if (!comments || !comments.length) { updateRatingFromLocal(); return; }
      const values = comments
        .map(c => c.body)
        .filter(b => b && b.indexOf(RATING_PREFIX) === 0)
        .map(b => parseInt(b.replace(RATING_PREFIX, '').trim(), 10))
        .filter(n => n >= 1 && n <= 5);
      if (!values.length) { updateRatingFromLocal(); return; }
      renderRating(values);
    })
    .catch(function () { updateRatingFromLocal(); });
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

  function loadGiscus() {
    const wrap = document.getElementById('giscus-wrap');
    if (!wrap) return;
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
    s.setAttribute('data-theme', localStorage.getItem('glassEffect') === 'on' ? 'transparent_dark' : 'preferred_color_scheme');
    s.setAttribute('data-lang', 'ru');
    s.setAttribute('crossorigin', 'anonymous');
    s.async = true;
    wrap.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    createReviewsSection();
    createRatingModal();

    const btn = document.getElementById('write-review-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('rating-modal').classList.add('show');
      });
    }

    if (GITHUB_TOKEN) updateRatingFromGitHub();
    else updateRatingFromLocal();
    loadGiscus();
  });
})();
