/* scroll-animate.js — плавное появление секций при прокрутке */
(function () {
  'use strict';

  // Все элементы, которые надо анимировать
  const selectors = [
    '.version-block',
    '.program-card',
    '.faq-item',
    '.content > h2',
    '.content > p',
    '.content > ul',
    '.screenshots',
    '.preview'
  ];

  const elements = document.querySelectorAll(selectors.join(','));

  if (!elements.length) return;

  // Проверяем поддержку IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Если браузер старый — просто показываем всё
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
})();
