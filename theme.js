/* theme.js — общий скрипт темы для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  const DEFAULTS = {
    bar: '#008000',
    bg:  '#ffffff'
  };

  function contrastColor(hex) {
    if (!hex || hex.length < 6) return '#000000';
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.6 ? '#000000' : '#ffffff';
  }

  function shade(hex, amount) {
    if (!hex || hex.length < 6) return hex;
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    r = Math.max(0, Math.min(255, Math.round(r + r * amount)));
    g = Math.max(0, Math.min(255, Math.round(g + g * amount)));
    b = Math.max(0, Math.min(255, Math.round(b + b * amount)));
    const to = n => n.toString(16).padStart(2, '0');
    return '#' + to(r) + to(g) + to(b);
  }

  function getBar() { return localStorage.getItem('colorBar') || DEFAULTS.bar; }
  function getBg()  { return localStorage.getItem('colorBg')  || DEFAULTS.bg;  }

  function apply(bar, bg) {
    const root = document.documentElement.style;
    root.setProperty('--bar',       bar);
    root.setProperty('--bar-text',  contrastColor(bar));
    root.setProperty('--btn-bg',    bar);
    root.setProperty('--btn-text',  contrastColor(bar));
    root.setProperty('--btn-hover', shade(bar, -0.2));
    root.setProperty('--bg',        bg);
    root.setProperty('--text',      contrastColor(bg));
    root.setProperty('--card',      shade(bg, -0.05));
  }

  // Применяем сразу
  apply(getBar(), getBg());

  // Публичный API для GlobalSettings.html
  window.Theme = {
    get bar() { return getBar(); },
    get bg()  { return getBg();  },
    setBar(color) { localStorage.setItem('colorBar', color); apply(getBar(), getBg()); },
    setBg(color)  { localStorage.setItem('colorBg',  color); apply(getBar(), getBg()); },
    applyColors(bar, bg) { apply(bar, bg); },
    reset() {
      localStorage.removeItem('colorBar');
      localStorage.removeItem('colorBg');
      apply(getBar(), getBg());
    },
    contrastColor: contrastColor,
    shade: shade
  };
})();
