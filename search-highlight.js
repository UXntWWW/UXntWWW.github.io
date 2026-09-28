/* search-highlight.js — подсветка найденного текста в поиске */
(function () {
  'use strict';

  function highlightInBlocks(input, blockSelector) {
    if (!input) return;

    var blocks = Array.from(document.querySelectorAll(blockSelector));
    if (!blocks.length) return;

    blocks.forEach(function (b) {
      if (!b.dataset.originalHtml) b.dataset.originalHtml = b.innerHTML;
    });

    var empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = (window.Lang && window.Lang.get() === 'en') ? 'Nothing found.' : 'Ничего не найдено.';
    empty.style.display = 'none';
    blocks[0].parentNode.insertBefore(empty, blocks[0]);

    function restoreAll() {
      blocks.forEach(function (b) {
        if (b.dataset.originalHtml) b.innerHTML = b.dataset.originalHtml;
        b.style.display = '';
      });
      document.querySelectorAll('.page-divider').forEach(function (hr) { hr.style.display = ''; });
    }

    function highlightNode(node, regex) {
      var text = node.nodeValue;
      if (!regex.test(text)) { regex.lastIndex = 0; return false; }
      regex.lastIndex = 0;

      var frag = document.createDocumentFragment();
      var lastIndex = 0;
      var m;
      while ((m = regex.exec(text)) !== null) {
        if (m.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
        }
        var span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = m[0];
        frag.appendChild(span);
        lastIndex = m.index + m[0].length;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      node.parentNode.replaceChild(frag, node);
      return true;
    }

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (!q) { restoreAll(); empty.style.display = 'none'; return; }

      var found = 0;
      var regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

      blocks.forEach(function (b) {
        if (b.dataset.originalHtml) b.innerHTML = b.dataset.originalHtml;
        var text = b.textContent.toLowerCase();
        var match = text.indexOf(q.toLowerCase()) !== -1;
        if (match) {
          found++;
          b.style.display = '';
          var walker = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null, false);
          var nodes = [];
          var n;
          while ((n = walker.nextNode())) nodes.push(n);
          nodes.forEach(function (node) { highlightNode(node, regex); });
        } else {
          b.style.display = 'none';
        }
      });

      document.querySelectorAll('.page-divider').forEach(function (hr) {
        hr.style.display = q ? 'none' : '';
      });

      empty.style.display = (found === 0) ? 'block' : 'none';
    });
  }

  function init() {
    var inp = document.getElementById('search');
    if (inp) highlightInBlocks(inp, '.version-block');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
