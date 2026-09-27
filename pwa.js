/* pwa.js — регистрация service worker для PWA */
(function () {
  'use strict';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // тихо игнорируем ошибки (например, при открытии с file://)
      });
    });
  }
})();
