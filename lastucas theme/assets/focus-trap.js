/* ============================================
   LASTUCAS Theme - 通用焦点管理工具
   供所有抽屉 / 弹层复用：focus trap + 焦点归还 + 背景 inert
   ============================================ */
(function () {
  'use strict';
  window.LASTUCAS = window.LASTUCAS || {};

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusable(root) {
    return Array.prototype.slice.call(root.querySelectorAll(FOCUSABLE)).filter(function (el) {
      return el.getAttribute('aria-hidden') !== 'true' && (el.offsetWidth > 0 || el.offsetHeight > 0);
    });
  }

  /* 把焦点锁在 container 内；关闭时调用返回的 cleanup 以归还焦点到触发元素 */
  window.LASTUCAS.trapFocus = function (container) {
    var previous = document.activeElement;
    var list = getFocusable(container);

    function onKey(e) {
      if (e.key !== 'Tab') return;
      var items = getFocusable(container);
      if (!items.length) { e.preventDefault(); return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !container.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', onKey);
    if (list.length) {
      setTimeout(function () { list[0].focus(); }, 0);
    }

    return function () {
      container.removeEventListener('keydown', onKey);
      if (previous && typeof previous.focus === 'function') {
        setTimeout(function () { previous.focus(); }, 0);
      }
    };
  };

  /* 打开抽屉/弹层时让背景不可聚焦（读屏不遍历）；关闭时恢复。用计数支持多层弹层叠加。 */
  var inertDepth = 0;
  window.LASTUCAS.setPageInert = function (active) {
    if (active) {
      inertDepth += 1;
    } else {
      inertDepth = Math.max(0, inertDepth - 1);
    }
    var shouldInert = inertDepth > 0;
    var bg = ['#MainContent', '.announcement-bar', '.footer'];
    bg.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (shouldInert) {
          el.setAttribute('inert', '');
        } else {
          el.removeAttribute('inert');
        }
      });
    });
    document.body.style.overflow = shouldInert ? 'hidden' : '';
  };
})();
