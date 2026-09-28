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

  function applyFontSize() {
    var size = localStorage.getItem('uiFontSize') || 'medium';
    var px = size === 'small' ? '14px' : (size === 'large' ? '18px' : '16px');
    document.documentElement.style.setProperty('--font-size-base', px);
    // НЕ ставим fontSize на html, чтобы не ломать адаптив
  }

  function applyRadius() {
    var r = localStorage.getItem('uiRadius') || 'soft';
    var radius = r === 'sharp' ? '4px' : (r === 'round' ? '24px' : '16px');
    var radiusSmall = r === 'sharp' ? '2px' : (r === 'round' ? '12px' : '10px');
    document.documentElement.style.setProperty('--radius', radius);
    document.documentElement.style.setProperty('--radius-small', radiusSmall);
  }

  function applyAnimations() {
    var on = localStorage.getItem('uiAnimations') !== 'off';
    document.body.classList.toggle('no-animations', !on);
  }

  function applyUltraSmooth() {
    var on = localStorage.getItem('uiUltraSmooth') === 'on';
    document.body.classList.toggle('ultra-smooth', on);
  }

  function applyCompact() {
    var on = localStorage.getItem('uiCompact') === 'on';
    document.body.classList.toggle('compact-mode', on);
  }

  function applyPattern() {
    var on = localStorage.getItem('uiPattern') === 'on';
    document.body.classList.toggle('pattern-bg', on);
  }

  function applyCardDensity() {
    var d = localStorage.getItem('uiCardDensity') || 'auto';
    var w = '280px';
    if (d === '1') w = '100%';
    else if (d === '2') w = '400px';
    else if (d === '3') w = '260px';
    document.documentElement.style.setProperty('--card-min-width', w);
  }

  function applyGlassOpacity() {
    var o = localStorage.getItem('uiGlassOpacity') || 'medium';
    var blur = o === 'weak' ? '10px' : (o === 'strong' ? '30px' : '20px');
    document.documentElement.style.setProperty('--glass-blur', 'blur(' + blur + ') saturate(180%)');
  }

  function applyAllUI() {
    applyFontSize();
    applyRadius();
    applyAnimations();
    applyUltraSmooth();
    applyCompact();
    applyPattern();
    applyCardDensity();
    applyGlassOpacity();
  }

  function apply(bar, bg) {
    const root = document.documentElement.style;

    root.setProperty('--bar',       bar);
    root.setProperty('--bg',        bg);
    root.setProperty('--card',      shade(bg, -0.05));
    root.setProperty('--btn-bg',    bar);
    root.setProperty('--btn-hover', shade(bar, -0.2));

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

    const tc = getTextColors(bar, bg);
    root.setProperty('--bar-text', tc.barText);
    root.setProperty('--text',     tc.pageText);
    root.setProperty('--text-link', tc.pageText);

    const glass = getGlass();
    const glassDark = isDark(bg);

    if (glass) {
      if (glassDark) {
        root.setProperty('--glass-bg',     'rgba(20, 22, 30, 0.78)');
        root.setProperty('--glass-bg-2',   'rgba(30, 32, 42, 0.88)');
        root.setProperty('--glass-border', 'rgba(255, 255, 255, 0.10)');
        root.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.55)');
      } else {
        root.setProperty('--glass-bg',     'rgba(255, 255, 255, 0.5)');
        root.setProperty('--glass-bg-2',   'rgba(255, 255, 255, 0.65)');
        root.setProperty('--glass-border', 'rgba(255, 255, 255, 0.7)');
        root.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.1)');
      }
      applyGlassOpacity();

      if (glassDark) {
        const gradColor  = shade(bar, -0.35);
        const gradColor2 = shade(bar, -0.55);
        root.setProperty('--page-gradient', 'linear-gradient(135deg, ' + gradColor + ' 0%, ' + gradColor2 + ' 100%)');
      } else {
        const gradColor  = lighten(bar, 0.65);
        const gradColor2 = lighten(bar, 0.9);
        root.setProperty('--page-gradient', 'linear-gradient(135deg, ' + gradColor + ' 0%, ' + gradColor2 + ' 100%)');
      }
    } else {
      root.setProperty('--glass-bg',     'transparent');
      root.setProperty('--glass-bg-2',   'transparent');
      root.setProperty('--glass-border', 'transparent');
      root.setProperty('--glass-shadow', 'none');
      root.setProperty('--glass-blur',   'none');
      root.setProperty('--page-gradient', 'none');
    }

    if (document.body) {
      document.body.classList.toggle('glass-mode', glass);
    }

    applyAllUI();
  }

  function boot() {
    const c = getColors();
    apply(c.bar, c.bg);
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (localStorage.getItem('themeMode') === 'presets' &&
          localStorage.getItem('presetName') === 'system') {
        boot();
      }
    });
  }

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
    refresh: boot,
    applyUI: applyAllUI,
    preview: function (bar, bg) {
      apply(bar, bg);
      const root = document.documentElement.style;
      const customBarText  = localStorage.getItem('colorTextBar');
      const customPageText = localStorage.getItem('colorTextPage');
      if (customBarText)  root.setProperty('--bar-text', customBarText);
      if (customPageText) {
        root.setProperty('--text', customPageText);
        root.setProperty('--text-link', customPageText);
      }
    }
  };
})();
