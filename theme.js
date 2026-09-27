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
    '#ffffff': 'white', '#fafafa': 'white',
    '#000000': 'black', '#0f1115': 'black',
    '#5a5a5a': 'gray',  '#d9d9d9': 'lightgray'
  };

  function colorKey(hex) {
    if (!hex) return '';
    const h = hex.toLowerCase();
    return COLOR_GROUPS[h] || h;
  }

  function colorsMatch(a, b) { return colorKey(a) === colorKey(b); }

  function colorName(hex) {
    const map = {
      '#008000': 'зелёный', '#4f8cff': 'синий', '#a06bff': 'фиолетовый',
      '#ff5c8a': 'розовый', '#ff8c42': 'оранжевый', '#e6c200': 'жёлтый',
      '#3ecf8e': 'мятный', '#ef4444': 'красный', '#0f1115': 'чёрный',
      '#ffffff': 'белый', '#1e5fd8': 'тёмно-синий', '#8b5e3c': 'коричневый',
      '#5a5a5a': 'серый', '#d9d9d9': 'светло-серый', '#000000': 'чёрный',
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

  function isDark(hex) {
    if (!hex || hex.length < 6) return false;
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
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

  function lighten(hex, amount) {
    if (!hex || hex.length < 6) return hex;
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
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

  function getGlass() {
    return localStorage.getItem('glassEffect') === 'on';
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
      else if (presetId === 'system') fill = systemPrefersDark() ? 'white' : 'black';
      else fill = 'white';
    } else {
      fill = 'white';
    }
    const navFill   = fill === 'black' ? '#000000' : '#ffffff';
    const navText   = fill === 'black' ? '#ffffff' : '#000000';
    const navBorder = fill === 'black' ? '#ffffff' : '#000000';

    root.setProperty('--nav-fill',   navFill);
    root.setProperty('--nav-text',   navText);
    root.setProperty('--nav-border', navBorder);

    // Поля ввода
    const bgDark = isDark(bg);
    if (bgDark) {
      root.setProperty('--input-bg',     '#ffffff');
      root.setProperty('--input-text',   '#000000');
      root.setProperty('--input-border', '#d9d9d9');
    } else {
      root.setProperty('--input-bg',     '#1a1d24');
      root.setProperty('--input-text',   '#ffffff');
      root.setProperty('--input-border', '#3a3d44');
    }

    // Текст
    const tc = getTextColors(bar, bg);
    root.setProperty('--bar-text', tc.barText);
    root.setProperty('--text',     tc.pageText);
    root.setProperty('--text-link', tc.pageText);

    // ===== Стекло =====
    const glass = getGlass();
    const glassDark = isDark(bg);

    if (glass) {
      // Стеклянные переменные
      if (glassDark) {
        // Тёмная тема — тёмное стекло
        root.setProperty('--glass-bg',     'rgba(30, 32, 40, 0.45)');
        root.setProperty('--glass-bg-2',   'rgba(40, 42, 52, 0.55)');
        root.setProperty('--glass-border', 'rgba(255, 255, 255, 0.12)');
        root.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.4)');
      } else {
        // Светлая тема — светлое стекло
        root.setProperty('--glass-bg',     'rgba(255, 255, 255, 0.45)');
        root.setProperty('--glass-bg-2',   'rgba(255, 255, 255, 0.6)');
        root.setProperty('--glass-border', 'rgba(255, 255, 255, 0.7)');
        root.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.1)');
      }
      root.setProperty('--glass-blur',   'blur(20px) saturate(180%)');

      // Градиентный фон под стеклом
      const gradColor = lighten(bar, 0.65);
      const gradColor2 = lighten(bar, 0.9);
      root.setProperty('--page-gradient', `linear-gradient(135deg, ${gradColor} 0%, ${gradColor2} 100%)`);
    } else {
      root.setProperty('--glass-bg',     'transparent');
      root.setProperty('--glass-bg-2',   'transparent');
      root.setProperty('--glass-border', 'transparent');
      root.setProperty('--glass-shadow', 'none');
      root.setProperty('--glass-blur',   'none');
      root.setProperty('--page-gradient', 'none');
    }

    // Класс на body
    document.body.classList.toggle('glass-mode', glass);
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
    isDark: isDark,
    colorKey: colorKey,
    colorsMatch: colorsMatch,
    colorName: colorName,
    getGlass: getGlass,
    applyColors: apply,
    getColors: getColors,
    getTextColors: getTextColors,
    refresh: function () { const x = getColors(); apply(x.bar, x.bg); }
  };
})();
