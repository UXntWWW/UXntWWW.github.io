/* theme.js — общий скрипт темы для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  const PRESETS = {
    base:   { bar: '#008000', bg: '#ffffff', btn: 'white' },
    light:  { bar: '#d9d9d9', bg: '#fafafa', btn: 'black' },
    gray:   { bar: '#5a5a5a', bg: '#e0e0e0', btn: 'black' },
    dark:   { bar: '#1f1f1f', bg: '#0f1115', btn: 'white' },
    system: { bar: null,      bg: null,      btn: null    }
  };

  const DEFAULTS = PRESETS.base;

  const COLOR_GROUPS = {
    '#ffffff': 'white',
    '#fafafa': 'white',
    '#000000': 'black',
    '#0f1115': 'black',
    '#5a5a5a': 'gray',
    '#d9d9d9': 'lightgray'
  };

  function colorKey(hex) {
    if (!hex) return '';
    const h = hex.toLowerCase();
    return COLOR_GROUPS[h] || h;
  }

  function colorsMatch(a, b) {
    return colorKey(a) === colorKey(b);
  }

  function colorName(hex) {
    const map = {
      '#008000': 'зелёный',
      '#4f8cff': 'синий',
      '#a06bff': 'фиолетовый',
      '#ff5c8a': 'розовый',
      '#ff8c42': 'оранжевый',
      '#e6c200': 'жёлтый',
      '#3ecf8e': 'мятный',
      '#ef4444': 'красный',
      '#0f1115': 'чёрный',
      '#ffffff': 'белый',
      '#1e5fd8': 'тёмно-синий',
      '#8b5e3c': 'коричневый',
      '#5a5a5a': 'серый',
      '#d9d9d9': 'светло-серый',
      '#000000': 'чёрный',
      '#fafafa': 'белый'
    };
    return map[(hex || '').toLowerCase()] || 'этот';
  }

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

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getColors() {
    const mode = localStorage.getItem('themeMode') || 'presets';
    if (mode === 'presets') {
      const id = localStorage.getItem('presetName') || 'base';
      if (id === 'system') {
        return systemPrefersDark()
          ? { bar: '#1f1f1f', bg: '#0f1115', btn: 'white' }
          : { bar: '#d9d9d9', bg: '#fafafa', btn: 'black' };
      }
      const p = PRESETS[id] || DEFAULTS;
      return { bar: p.bar, bg: p.bg, btn: p.btn || 'white' };
    }
    return {
      bar: localStorage.getItem('colorBar') || DEFAULTS.bar,
      bg:  localStorage.getItem('colorBg')  || DEFAULTS.bg,
      btn: 'white'
    };
  }

  function getTextColors(bar, bg) {
    const mode = localStorage.getItem('themeMode') || 'presets';
    if (mode === 'custom') {
      return {
        barText:  localStorage.getItem('colorTextBar')  || contrastColor(bar),
        pageText: localStorage.getItem('colorTextPage') || contrastColor(bg)
      };
    }
    return {
      barText:  contrastColor(bar),
      pageText: contrastColor(bg)
    };
  }

  function apply(bar, bg) {
    const root = document.documentElement.style;

    root.setProperty('--bar',       bar);
    root.setProperty('--bg',        bg);
    root.setProperty('--card',      shade(bg, -0.05));
    root.setProperty('--btn-bg',    bar);
    root.setProperty('--btn-hover', shade(bar, -0.2));

    // Кнопки — по теме
    const mode = localStorage.getItem('themeMode') || 'presets';
    const presetId = localStorage.getItem('presetName') || 'base';
    let fill = 'white';
    if (mode === 'presets') {
      if (presetId === 'light' || presetId === 'gray') fill = 'black';
      else if (presetId === 'system') {
        fill = systemPrefersDark() ? 'white' : 'black';
      } else {
        fill = 'white';
      }
    } else {
      fill = 'white';
    }
    const navFill   = fill === 'black' ? '#000000' : '#ffffff';
    const navText   = fill === 'black' ? '#ffffff' : '#000000';
    const navBorder = fill === 'black' ? '#ffffff' : '#000000';

    root.setProperty('--nav-fill',   navFill);
    root.setProperty('--nav-text',   navText);
    root.setProperty('--nav-border', navBorder);

    const tc = getTextColors(bar, bg);
    root.setProperty('--bar-text', tc.barText);
    root.setProperty('--text',     tc.pageText);
  }

  const c = getColors();
  apply(c.bar, c.bg);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (localStorage.getItem('themeMode') === 'presets' &&
          localStorage.getItem('presetName') === 'system') {
        const x = getColors();
        apply(x.bar, x.bg);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const x = getColors();
    apply(x.bar, x.bg);
  });

  window.Theme = {
    contrastColor: contrastColor,
    shade: shade,
    colorKey: colorKey,
    colorsMatch: colorsMatch,
    colorName: colorName,
    applyColors: apply,
    getColors: getColors,
    getTextColors: getTextColors,
    refresh: function () { const x = getColors(); apply(x.bar, x.bg); }
  };
})();
