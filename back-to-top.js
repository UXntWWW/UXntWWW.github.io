/* back-to-top.js — кнопка "Вверх" в правом верхнем углу */
(function () {
  'use strict';

  function t(key, fallback) {
    if (window.Lang && window.Lang.t) {
      var v = window.Lang.t(key);
      if (v && v !== key) return v;
    }
    return fallback || key;
  }

  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Up');
  document.body.appendChild(btn);

  function render() {
    btn.innerHTML = t('nav.up', 'Вверх') + ' <span class="arrow">↑</span>';
  }

  function check() {
    if (window.scrollY > 200) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }

  window.addEventListener('scroll', check);
  check();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('langChanged', render);
  document.addEventListener('langReady', render);

  render();
})();
