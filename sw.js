/* sw.js — простейший service worker для офлайн-режима UXNTWWW.io */
const CACHE = 'uxntwww-v1';

const ASSETS = [
  './',
  './index.html',
  './files.html',
  './files1.html',
  './about.html',
  './contacts.html',
  './faq.html',
  './GlobalSettings.html',
  './theme.js',
  './common.css',
  './back-to-top.js',
  './pwa.js',
  './manifest.json'
];

// Установка — кэшируем основные файлы
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // addAll падает, если хоть один файл недоступен — поэтому оборачиваем
      return Promise.all(
        ASSETS.map(function (url) {
          return cache.add(url).catch(function () { /* пропускаем отсутствующие */ });
        })
      );
    })
  );
  self.skipWaiting();
});

// Активация — чистим старые кэши
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Запросы — сначала сеть, при ошибке — кэш
self.addEventListener('fetch', function (event) {
  // Не кэшируем запросы не-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Обновляем кэш свежей версией
        const copy = response.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(event.request, copy).catch(function () {});
        });
        return response;
      })
      .catch(function () {
        // Сеть недоступна — берём из кэша
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
  );
});
