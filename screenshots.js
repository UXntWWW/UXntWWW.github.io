/* screenshots.js — полноэкранный просмотр скриншотов с плавной FLIP-анимацией */
(function () {
  'use strict';

  const imgs = document.querySelectorAll('.screenshots img');
  if (!imgs.length) return;

  // Оверлей
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-overlay';
  overlay.innerHTML = '<img alt="">';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');

  let isOpen = false;
  let currentImg = null;
  let startRect = null;
  let isAnimating = false;

  function openOverlay(img) {
    if (isAnimating || isOpen) return;
    isAnimating = true;

    currentImg = img;
    startRect = img.getBoundingClientRect();

    // Клонируем изображение в оверлей
    overlayImg.src = img.src;
    overlayImg.alt = img.alt;

    // Начальное положение оверлея — совпадает с позицией картинки
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Считаем финальные размеры
    const imgNaturalRatio = img.naturalWidth / img.naturalHeight || 1;
    const maxW = window.innerWidth  * 0.95;
    const maxH = window.innerHeight * 0.95;
    let targetW = maxW;
    let targetH = targetW / imgNaturalRatio;
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * imgNaturalRatio;
    }

    const targetLeft = (window.innerWidth  - targetW) / 2;
    const targetTop  = (window.innerHeight - targetH) / 2;

    // Ставим оверлей-картинку в стартовую позицию
    overlayImg.style.transition = 'none';
    overlayImg.style.position = 'fixed';
    overlayImg.style.left    = startRect.left   + 'px';
    overlayImg.style.top     = startRect.top    + 'px';
    overlayImg.style.width   = startRect.width  + 'px';
    overlayImg.style.height  = startRect.height + 'px';
    overlayImg.style.borderRadius = '10px';
    overlayImg.style.objectFit = 'cover';

    overlay.classList.add('visible');

    // Скрываем оригинал, чтобы не было дублирования
    img.style.visibility = 'hidden';

    // Следующий кадр — плавно перелетаем
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlayImg.style.transition = 'left .38s cubic-bezier(.22,.61,.36,1), top .38s cubic-bezier(.22,.61,.36,1), width .38s cubic-bezier(.22,.61,.36,1), height .38s cubic-bezier(.22,.61,.36,1), border-radius .38s, object-fit .38s';
        overlayImg.style.left    = targetLeft + 'px';
        overlayImg.style.top     = targetTop  + 'px';
        overlayImg.style.width   = targetW    + 'px';
        overlayImg.style.height  = targetH    + 'px';
        overlayImg.style.borderRadius = '14px';
        overlayImg.style.objectFit = 'contain';

        setTimeout(() => {
          isOpen = true;
          isAnimating = false;
        }, 400);
      });
    });
  }

  function closeOverlay() {
    if (isAnimating || !isOpen || !currentImg) return;
    isAnimating = true;

    const endRect = currentImg.getBoundingClientRect();

    overlayImg.style.transition = 'left .35s cubic-bezier(.22,.61,.36,1), top .35s cubic-bezier(.22,.61,.36,1), width .35s cubic-bezier(.22,.61,.36,1), height .35s cubic-bezier(.22,.61,.36,1), border-radius .35s, object-fit .35s';
    overlayImg.style.left    = endRect.left   + 'px';
    overlayImg.style.top     = endRect.top    + 'px';
    overlayImg.style.width   = endRect.width  + 'px';
    overlayImg.style.height  = endRect.height + 'px';
    overlayImg.style.borderRadius = '10px';
    overlayImg.style.objectFit = 'cover';

    overlay.classList.remove('visible');

    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      currentImg.style.visibility = '';
      isOpen = false;
      isAnimating = false;
      currentImg = null;
    }, 370);
  }

  imgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openOverlay(img));
  });

  // Клик по оверлею — закрыть (если это не клик по картинке в оверлее)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // Клик по самой увеличенной картинке — тоже закрыть
  overlayImg.addEventListener('click', (e) => {
    e.stopPropagation();
    closeOverlay();
  });

  // Escape — закрыть
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeOverlay();
  });

  // Ресайз окна — пересчитать, если открыто
  window.addEventListener('resize', () => {
    if (isOpen && currentImg) {
      // Закрываем и снова открываем — проще, чем пересчитывать
      closeOverlay();
    }
  });
})();
