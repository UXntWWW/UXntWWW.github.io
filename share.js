/* share.js — кнопка "Поделиться" на страницах */
(function () {
  'use strict';

  function build() {
    var content = document.querySelector('.content');
    if (!content) return;

    if (document.querySelector('.share-bar')) return;

    var bar = document.createElement('div');
    bar.className = 'share-bar';

    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);

    bar.innerHTML =
      '<span class="share-label">Поделиться:</span>' +
      '<button type="button" class="share-btn share-copy" data-url="' + window.location.href + '">🔗 Копировать ссылку</button>' +
      '<a class="share-btn" href="https://t.me/share/url?url=' + url + '&text=' + title + '" target="_blank" rel="noopener">✈️ Telegram</a>' +
      '<a class="share-btn" href="https://vk.com/share.php?url=' + url + '" target="_blank" rel="noopener">VK</a>';

    content.appendChild(bar);

    var copyBtn = bar.querySelector('.share-copy');
    copyBtn.addEventListener('click', function () {
      var url = copyBtn.dataset.url;

      function done() {
        var old = copyBtn.textContent;
        copyBtn.textContent = '✓ Скопировано';
        setTimeout(function () { copyBtn.textContent = old; }, 1500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {
          fallbackCopy(url); done();
        });
      } else {
        fallbackCopy(url); done();
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
