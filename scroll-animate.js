/* scroll-animate.js — плавное появление секций при прокрутке */
(function () {
  'use strict';

  var selectors = [
    '.version-block', '.program-card', '.faq-item',
    '.content > h2', '.content > p', '.content > ul',
    '.screenshots', '.preview', '.install-step',
    '.stat-card', '.recent-section'
  ];

  var elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  // Если анимации выключены — сразу показать всё
  if (localStorage.getItem('uiAnimations') === 'off') {
    elements.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });

  // Через 800мс — принудительно показать всё, что в зоне видимости
  setTimeout(function () {
    document.querySelectorAll('.scroll-animate:not(.in-view)').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('in-view');
      }
    });
  }, 800);
})();
