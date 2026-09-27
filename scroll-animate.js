/* scroll-animate.js — плавное появление секций при прокрутке */
(function () {
  'use strict';

  const selectors = [
    '.version-block', '.program-card', '.faq-item',
    '.content > h2', '.content > p', '.content > ul',
    '.screenshots', '.preview'
  ];

  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
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
    threshold: 0,
    rootMargin: '0px 0px 0px 0px'
  });

  elements.forEach(function (el) {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });

  // Через 600мс — принудительно показать всё, что ещё спрятано
  setTimeout(function () {
    document.querySelectorAll('.scroll-animate:not(.in-view)').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('in-view');
      }
    });
  }, 600);
})();
