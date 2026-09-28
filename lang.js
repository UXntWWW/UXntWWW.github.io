/* lang.js — переключение языка RU / EN для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  const LANGS = ['ru', 'en'];
  const DEFAULT_LANG = 'ru';

  function getLang() {
    const saved = localStorage.getItem('siteLang');
    if (saved && LANGS.indexOf(saved) !== -1) return saved;

    const browser = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
    if (browser.startsWith('ru')) return 'ru';
    if (browser.startsWith('en')) return 'en';
    return DEFAULT_LANG;
  }

  let currentLang = getLang();
  let translations = {};

  function loadTranslations(lang) {
    return fetch('lang/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .catch(function () { return {}; });
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      const value = translations[key];
      if (value === undefined) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.dataset.i18nTitle;
      if (translations[key]) document.title = translations[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.dataset.i18nPlaceholder;
      if (translations[key]) el.placeholder = translations[key];
    });

    document.documentElement.lang = currentLang;
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    currentLang = lang;
    localStorage.setItem('siteLang', lang);

    loadTranslations(lang).then(function (data) {
      translations = data;
      applyTranslations();
      document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang } }));
    });
  }

  window.Lang = {
    get: function () { return currentLang; },
    set: setLang,
    t: function (key) { return translations[key] || key; },
    apply: applyTranslations,
    available: LANGS
  };

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
