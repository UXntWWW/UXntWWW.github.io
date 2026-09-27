/* theme.js — общий скрипт темы для всех страниц UXNTWWW.io */
(function () {
  'use strict';

  const PRESETS = {
    base:   { bar: '#008000', bg: '#ffffff' },
    light:  { bar: '#d9d9d9', bg: '#fafafa' },
    gray:   { bar: '#5a5a5a', bg: '#e0e0e0' },
    dark:   { bar: '#1f1f1f', bg: '#0f1115' },
    system: { bar: null,      bg: null      }
  };

  const DEFAULTS = PRESETS.base;

  const ICON_MAP = {
    '#008000': 'icon-green.png',
    '#4f8cff': 'icon-blue.png',
    '#a06bff': 'icon-purple.png',
    '#ff5c8a': 'icon-pink.png',
    '#ff8c42': 'icon-orange.png',
    '#e6c200': 'icon-yellow.png',
    '#3ecf8e': 'icon-mint.png',
    '#ef4444': 'icon-red.png',
    '#0f1115': 'icon-black.png',
    '#ffffff': 'icon-white.png',
    '#1e5fd8': 'icon-navy.png',
    '#8b5e3c': 'icon-brown.png',
    '#5a5a5a': 'icon-gray.png',
    '#d9d9d9': 'icon-light.png',
    '#000000': 'icon-dark.png',
    '#fafafa': 'icon-white2.png'
  };

  const DEFAULT_ICON = 'icon-green.png';

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
          ? { bar: '#1f1f1f', bg: '#0f1115' }
          : { bar: '#008000', bg: '#ffffff' };
      }
      const p = PRESETS[id] || DEFAULTS;
      return { bar: p.bar, bg: p.bg };
    }
    return {
      bar: localStorage.getItem('colorBar') || DEFAULTS.bar,
      bg:  localStorage.getItem('colorBg')  || DEFAULTS.bg
    };
  }

  function setFavicon(hex) {
    const file = ICON_MAP[(hex || '').toLowerCase()] || DEFAULT_ICON;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = file;
  }

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

  const c = getColors();
  apply(c.bar, c.bg);

  const iconColor = localStorage.getItem('colorIcon') || '#008000';
  setFavicon(iconColor);

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
    const ic = localStorage.getItem('colorIcon') || '#008000';
    setFavicon(ic);
  });

  window.Theme = {
    contrastColor: contrastColor,
    shade: shade,
    applyColors: apply,
    setFavicon: setFavicon,
    iconMap: ICON_MAP,
    defaultIcon: DEFAULT_ICON,
    refresh: function () {
      const x = getColors();
      apply(x.bar, x.bg);
      const ic = localStorage.getItem('colorIcon') || '#008000';
      setFavicon(ic);
    }
  };
})();
