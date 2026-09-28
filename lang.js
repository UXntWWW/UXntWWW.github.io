/* lang.js — переключение языка RU / EN для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  // Доступные языки
  const LANGS = ['ru', 'en'];
  const DEFAULT_LANG = 'ru';

  // Получить текущий язык
  function getLang() {
    const saved = localStorage.getItem('siteLang');
    if (saved && LANGS.indexOf(saved) !== -1) return saved;

    // Автоопределение по браузеру
    const browser = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
    if (browser.startsWith('ru')) return 'ru';
    if (browser.startsWith('en')) return 'en';
    return DEFAULT_LANG;
  }

  let currentLang = getLang();
  let translations = {};

  // Загрузить JSON языка
  function loadTranslations(lang) {
    return fetch('lang/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .catch(function () { return {}; });
  }

  // Применить переводы ко всем элементам с data-i18n
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      const value = translations[key];
      if (value === undefined) return;

      // Если элемент input/textarea — переводим placeholder
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    // Переводим title
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.dataset.i18nTitle;
      if (translations[key]) document.title = translations[key];
    });

    // Обновляем lang в <html>
    document.documentElement.lang = currentLang;
  }

  // Переключить язык
  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    currentLang = lang;
    localStorage.setItem('siteLang', lang);

    loadTranslations(lang).then(function (data) {
      translations = data;
      applyTranslations();
      // Сообщаем другим скриптам
      document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang } }));
    });
  }

  // Публичный API
  window.Lang = {
    get: function () { return currentLang; },
    set: setLang,
    t: function (key) { return translations[key] || key; },
    apply: applyTranslations,
    available: LANGS
  };

  // Автозапуск
  function boot() {
    loadTranslations(currentLang).then(function (data) {
      translations = data;
      applyTranslations();
      document.dispatchEvent(new CustomEvent('langReady', { detail: { lang: currentLang } }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
