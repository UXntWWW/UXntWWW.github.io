/* back-to-top.js — кнопка "Вверх" в правом верхнем углу */
(function () {
  'use strict';

  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = 'Вверх <span class="arrow">↑</span>';
  btn.setAttribute('aria-label', 'Наверх');
  document.body.appendChild(btn);

  function check() {
    if (window.scrollY > 200) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }

  window.addEventListener('scroll', check);
  check();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
