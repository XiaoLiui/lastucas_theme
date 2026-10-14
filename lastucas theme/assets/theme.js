/* ============================================
   SUNMORY Minimal Theme - 全局交互
   原生 JS，不依赖任何库。改交互只动这里。
   ============================================ */

(function () {
  'use strict';

  /* --- 货币格式化：与 Shopify `money` 过滤器一致，支持多币种 --- */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') { cents = cents.replace('.', ''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || '{{amount}}';

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = (precision === undefined) ? 2 : precision;
      thousands = thousands || ',';
      decimal = decimal || '.';
      if (isNaN(number) || number == null) { return '0'; }
      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';
      return dollarsAmount + centsAmount;
    }

    var match = formatString.match(placeholderRegex);
    var option = match ? match[1] : 'amount';
    switch (option) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = formatWithDelimiters(cents, 2);
    }
    return formatString.replace(placeholderRegex, value);
  }

  // cents = 店铺货币金额（分）。换算为顾客当前货币（Shopify Markets 多币种）后，
  // 用店铺配置的货币格式（含符号 ¥/$ 等）格式化，保证与 Liquid `money` 一致。
  function money(cents) {
    var amount = Number(cents) || 0;
    try {
      var c = window.Shopify && window.Shopify.currency;
      if (c && c.rate) {
        var r = parseFloat(c.rate);
        if (isFinite(r) && r > 0) { amount = amount * r; }
      }
    } catch (e) {}
    var fmt = (window.SUNMORY && window.SUNMORY.moneyFormat) || '{{amount}}';
    return formatMoney(amount, fmt);
  }

  // 更新购物车角标：按产品种类数计；0 件时隐藏角标
  function updateBadge(count) {
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = count;
      el.hidden = (count === 0);
    });
  }

  /* --- Mobile Menu Drawer --- */
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuCloseBtns = document.querySelectorAll('[data-mobile-menu-close]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    menuCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Hero 轮播 --- */
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = hero.querySelectorAll('[data-slide]');
    const dots = hero.querySelectorAll('[data-dot]');
    let current = 0;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots.forEach(d => d.classList.remove('is-active'));
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
    }

    hero.querySelectorAll('[data-arrow]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.arrow === 'next' ? 1 : -1;
        goTo(current + dir);
      });
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => goTo(Number(dot.dataset.dot)));
    });

    // 自动轮播（8 秒）
    if (slides.length > 1) {
      setInterval(() => goTo(current + 1), 8000);
    }
  }

  /* --- 移动端菜单按钮（预留，后续接抽屉） --- */
  const toggle = document.querySelector('.header__menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open');
    });
  }

  /* --- 搜索抽屉 --- */
  const searchDrawer = document.querySelector('[data-search-drawer]');
  const searchOpenBtn = document.querySelector('[data-search-open]');
  const searchCloseBtns = document.querySelectorAll('[data-search-close]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const searchLoading = document.querySelector('[data-search-loading]');
  const searchTrending = document.querySelector('[data-search-trending]');
  const searchForm = document.querySelector('[data-search-form]');

  function openSearchDrawer() {
    searchDrawer.classList.add('is-open');
    searchDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
  }

  function closeSearchDrawer() {
    searchDrawer.classList.remove('is-open');
    searchDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchLoading.hidden = true;
    // 关闭时恢复显示热门产品
    searchTrending.hidden = false;
  }

  if (searchOpenBtn) {
    searchOpenBtn.addEventListener('click', openSearchDrawer);
  }
  searchCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeSearchDrawer);
  });

  // 表单提交：跳转到完整搜索结果页
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      // 让表单正常提交，跳转到 /search?q=xxx
    });
  }

  // 搜索输入防抖
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const q = e.target.value.trim();
      if (!q) {
        searchResults.innerHTML = '';
        searchLoading.hidden = true;
        // 清空时恢复显示热门产品
        searchTrending.hidden = false;
        return;
      }

      // 输入时隐藏热门产品，显示加载状态
      searchTrending.hidden = true;
      searchLoading.hidden = false;
      searchResults.innerHTML = '';

      searchTimeout = setTimeout(() => {
        // 全量搜索：产品 + 分类 + 页面 + 博客文章
        fetch(`/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product,collection,page,article&resources[limit]=3`)
          .then(res => res.json())
          .then(data => {
            searchLoading.hidden = true;
            const results = data.resources?.results || {};
            const products = results.products || [];
            const collections = results.collections || [];
            const pages = results.pages || [];
            const articles = results.articles || [];

            if (products.length === 0 && collections.length === 0 && pages.length === 0 && articles.length === 0) {
              searchResults.innerHTML = '<div class="search-drawer__empty">No results found.</div>';
              return;
            }

            let html = '';

            // 产品结果
            if (products.length > 0) {
              html += '<div class="search-drawer__group-title">Products</div>';
              html += products.map(p => `
                <a href="${p.url}" class="search-drawer__result-item">
                  <img class="search-drawer__result-img" src="${p.image || ''}" alt="${p.title}">
                  <div class="search-drawer__result-info">
                    <div class="search-drawer__result-title">${p.title}</div>
                    <div class="search-drawer__result-price">${money(p.price)}</div>
                  </div>
                </a>
              `).join('');
            }

            // 分类结果
            if (collections.length > 0) {
              html += '<div class="search-drawer__group-title">Collections</div>';
              html += collections.map(c => `
                <a href="${c.url}" class="search-drawer__result-item">
                  <div class="search-drawer__result-info">
                    <div class="search-drawer__result-title">${c.title}</div>
                    <div class="search-drawer__result-type">Collection</div>
                  </div>
                </a>
              `).join('');
            }

            // 页面结果
            if (pages.length > 0) {
              html += '<div class="search-drawer__group-title">Pages</div>';
              html += pages.map(p => `
                <a href="${p.url}" class="search-drawer__result-item">
                  <div class="search-drawer__result-info">
                    <div class="search-drawer__result-title">${p.title}</div>
                    <div class="search-drawer__result-type">Page</div>
                  </div>
                </a>
              `).join('');
            }

            // 博客文章结果
            if (articles.length > 0) {
              html += '<div class="search-drawer__group-title">Articles</div>';
              html += articles.map(a => `
                <a href="${a.url}" class="search-drawer__result-item">
                  <div class="search-drawer__result-info">
                    <div class="search-drawer__result-title">${a.title}</div>
                    <div class="search-drawer__result-type">Blog Article</div>
                  </div>
                </a>
              `).join('');
            }

            // 查看全部结果按钮
            html += `<a href="/search?q=${encodeURIComponent(q)}" class="search-drawer__view-all">View all results →</a>`;

            searchResults.innerHTML = html;
          })
          .catch(err => {
            searchLoading.hidden = true;
            searchResults.innerHTML = '<div class="search-drawer__empty">Search failed. Please try again.</div>';
          });
      }, 300);
    });
  }

  /* --- 购物车抽屉 --- */
  const drawer = document.querySelector('[data-cart-drawer]');
  const cartOpenBtn = document.querySelector('[data-cart-open]');
  const cartBody = document.querySelector('[data-cart-body]');
  const cartFooter = document.querySelector('[data-cart-footer]');
  const cartSubtotal = document.querySelector('[data-cart-subtotal]');
  const cartRecommendations = document.querySelector('[data-cart-recommendations]');

  // 登录状态（由 theme.liquid 注入）：true=登录，false=未登录
  const customerLoggedIn = !!(window.SUNMORY && window.SUNMORY.customerLoggedIn);
  const CART_CACHE_KEY = 'sunmory:cart';

  let currentCart = null; // 内存中的购物车状态

  // 免邮门槛（单位：分）。0 = 全场免邮（固定显示 "You are eligible for free shipping."）
  // 例：满 $100 免邮改为 10000，未满时显示 "You're $X away from free shipping."
  const FREE_SHIPPING_THRESHOLD = 0;

  function updateShippingMsg(subtotalCents) {
    const msg = document.querySelector('[data-cart-shipping]');
    if (!msg) return;
    if (FREE_SHIPPING_THRESHOLD <= 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD) {
      msg.textContent = 'You are eligible for free shipping.';
    } else {
      msg.textContent = "You're " + money(FREE_SHIPPING_THRESHOLD - subtotalCents) + ' away from free shipping.';
    }
    msg.hidden = false;
  }

  function cacheRead() {
    try { return JSON.parse(localStorage.getItem(CART_CACHE_KEY)); }
    catch (e) { return null; }
  }
  function cacheWrite(cart) {
    try { localStorage.setItem(CART_CACHE_KEY, JSON.stringify(cart)); }
    catch (e) {}
  }

  // 依据 items 重算 item_count / 小计（乐观更新后保证数字正确）
  function recalc(cart) {
    let count = 0, subtotal = 0;
    (cart.items || []).forEach(function (it) {
      const price = it.final_price || it.price || 0;
      count += it.quantity;
      subtotal += price * it.quantity;
    });
    cart.item_count = count;
    cart.items_subtotal_price = subtotal;
    cart.total_price = subtotal;
    return cart;
  }

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    loadCart();
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  async function loadCart() {
    const cached = cacheRead();
    const hasCache = cached && cached.items && cached.items.length > 0;

    if (customerLoggedIn) {
      // 登录：强制与服务器同步账户购物车
      cartBody.innerHTML = '<div class="cart-drawer__loading">Loading…</div>';
    } else if (hasCache) {
      // 未登录：本地浏览器缓存秒开
      currentCart = recalc(cached);
      renderCart(currentCart);
    } else {
      cartBody.innerHTML = '<div class="cart-drawer__loading">Loading…</div>';
    }

    // 与服务器同步
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      // 未登录且本地已有缓存时，信任本地乐观值，不覆盖（避免把用户刚操作的结果冲掉）
      if (!customerLoggedIn && hasCache) return;
      currentCart = cart;
      cacheWrite(cart);
      renderCart(cart);
    } catch (e) {
      if (!currentCart) {
        cartBody.innerHTML = '<div class="cart-drawer__empty">Failed to load cart.</div>';
      }
    }
  }

  function renderCart(cart) {
    // 更新角标：按产品种类数（items 行数）计，不按总件数；0 件时隐藏
    updateBadge((cart.items || []).length);

    // 抽屉「清空购物车」按钮：有商品才显示
    const drawerClearBtn = document.querySelector('.cart-drawer__clear');
    if (drawerClearBtn) drawerClearBtn.hidden = cart.item_count === 0;

    // 订单备注回显
    const noteInput = document.querySelector('[data-order-note-input]');
    if (noteInput && document.activeElement !== noteInput) {
      noteInput.value = cart.note || '';
    }

    if (cart.item_count === 0) {
      const shippingMsg = document.querySelector('[data-cart-shipping]');
      if (shippingMsg) shippingMsg.hidden = true;
      cartBody.innerHTML = `
        <div class="cart-drawer__empty">
          <h2>Your cart is empty</h2>
          <a href="/collections/all" class="cart-drawer__continue-btn">Continue shopping</a>
          <div class="cart-drawer__login-prompt">
            <h3>Have an account?</h3>
            <a href="/account">Log in to check out faster.</a>
          </div>
        </div>
      `;
      cartFooter.hidden = true;
      if (cartRecommendations) cartRecommendations.hidden = false;
      return;
    }

    cartFooter.hidden = false;
    if (cartRecommendations) cartRecommendations.hidden = true;
    cartSubtotal.textContent = money(cart.total_price);
    updateShippingMsg(cart.total_price);

    cartBody.innerHTML = cart.items.map((item, index) => {
      const line = index + 1; // 1-based，对应 /cart/change.js 的 line 参数
      const unit = item.final_price || item.price || 0;
      const productUrl = item.url || '#';
      const variantText = item.variant_title
        ? `<div class="cart-drawer__item-variant">${item.variant_title}</div>`
        : '';
      return `
      <div class="cart-drawer__item" data-line="${line}">
        <a class="cart-drawer__item-img-link" href="${productUrl}">
          <img class="cart-drawer__item-img" src="${item.image || ''}" alt="${item.product_title}">
        </a>
        <div class="cart-drawer__item-info">
          <a class="cart-drawer__item-title-link" href="${productUrl}">
            <div class="cart-drawer__item-title">${item.product_title}</div>
          </a>
          <div class="cart-drawer__item-price">${money(unit)}</div>
          ${variantText}
        </div>
        <div class="cart-drawer__item-side">
          <input type="number" class="cart-drawer__item-qty-box" value="${item.quantity}" min="0" data-qty-input aria-label="Quantity">
          <button type="button" class="cart-drawer__remove" data-remove>Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  // 局部更新某一行（数量变化 / 删除），不重建整个列表
  function updateLineUI(line) {
    const itemEl = cartBody.querySelector('.cart-drawer__item[data-line="' + line + '"]');
    const item = (currentCart.items || [])[line - 1];

    if (!item || item.quantity <= 0) {
      if (itemEl) itemEl.remove();
    } else if (itemEl) {
      const input = itemEl.querySelector('[data-qty-input]');
      if (input && document.activeElement !== input) input.value = item.quantity;
    }

    cartSubtotal.textContent = money(currentCart.total_price);
    updateShippingMsg(currentCart.total_price);
    // 角标按产品种类数（行数）计；0 件时隐藏
    updateBadge((currentCart.items || []).length);

    // 清空时显示空购物车状态
    if (currentCart.item_count === 0) {
      renderCart(currentCart);
    }
  }

  // 乐观更新：先本地改状态 + 局部 UI（立即反应），再后台同步服务器
  async function changeLine(line, quantity) {
    if (!currentCart || !currentCart.items) { await loadCart(); }
    if (!currentCart || !currentCart.items) return;

    const idx = line - 1;
    if (idx < 0 || idx >= currentCart.items.length) return;

    // 1) 本地乐观更新
    const items = currentCart.items.slice();
    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx] = Object.assign({}, items[idx], { quantity: quantity });
    }
    currentCart = recalc(Object.assign({}, currentCart, { items: items }));
    cacheWrite(currentCart);

    // 2) 立即局部更新 UI（对应反应，不刷新整个抽屉）
    if (quantity <= 0) {
      renderCart(currentCart); // 删除会让后续行 line 重排，需整体重渲染（无 Loading）
    } else {
      updateLineUI(line); // 数量增减只局部更新该行
    }

    // 3) 后台同步服务器
    if (customerLoggedIn) {
      // 登录：以服务器为准，await 返回并覆盖
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line, quantity })
        });
        if (!res.ok) throw new Error('change failed');
        const cart = await res.json();
        currentCart = cart;
        cacheWrite(cart);
        renderCart(cart); // 用服务器权威数据校正
      } catch (e) {
        loadCart(); // 登录态同步失败：从服务器重新拉取校正
      }
    } else {
      // 未登录：购物车以本地 localStorage 为准。fire-and-forget 尽力同步服务器，
      // 但不覆盖本地、失败不回滚，确保点击后数量/金额立即变化且不被服务器旧数据冲掉（不再"变回1"）。
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity })
      }).catch(() => {
        // 忽略同步失败，本地缓存保留用户操作结果
      });
    }
  }

  if (cartOpenBtn) {
    cartOpenBtn.addEventListener('click', openDrawer);
  }
  if (drawer) {
    drawer.querySelectorAll('[data-cart-close]').forEach(el => {
      el.addEventListener('click', closeDrawer);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // 事件委托：数量输入框修改 / 移除
  if (cartBody) {
    cartBody.addEventListener('change', (e) => {
      if (!e.target.matches('[data-qty-input]')) return;
      const item = e.target.closest('.cart-drawer__item');
      if (!item) return;
      const line = Number(item.dataset.line);
      const q = parseInt(e.target.value, 10);
      changeLine(line, isNaN(q) || q < 0 ? 0 : q);
    });
    cartBody.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-drawer__item');
      if (!item) return;
      const line = Number(item.dataset.line);
      if (e.target.matches('[data-remove]')) {
        changeLine(line, 0);
      }
    });
  }

  // 订单备注：展开 / 保存（/cart/update.js note 字段）
  const noteToggle = document.querySelector('[data-order-note-toggle]');
  const noteInput = document.querySelector('[data-order-note-input]');
  if (noteToggle && noteInput) {
    noteToggle.addEventListener('click', () => {
      noteInput.hidden = !noteInput.hidden;
      if (!noteInput.hidden) noteInput.focus();
    });
    noteInput.addEventListener('change', () => {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteInput.value })
      }).then(res => res.json()).then(cart => {
        if (currentCart) currentCart.note = cart.note || noteInput.value;
        cacheWrite(currentCart || cart);
      }).catch(() => {});
    });
  }

  /* --- 购物车页：数量 +/- 与行小计、小计实时联动（乐观更新 + /cart/update.js 同步） --- */
  const cartPageEl = document.querySelector('.cart-page');
  if (cartPageEl) {
    const pageSubtotal = cartPageEl.querySelector('[data-cart-page-subtotal]');

    function recalcPageSubtotal() {
      let sum = 0;
      cartPageEl.querySelectorAll('.cart-line').forEach(function (ln) {
        sum += Number(ln.dataset.linePrice) || 0;
      });
      return sum;
    }

    function refreshPageTotals() {
      const lines = cartPageEl.querySelectorAll('.cart-line');
      if (pageSubtotal) pageSubtotal.textContent = money(recalcPageSubtotal());
      // 角标按剩余行数计（产品种类数），0 件时隐藏
      updateBadge(lines.length);
      // 购物车清空后禁用 Check out 按钮
      const checkoutBtn = cartPageEl.querySelector('.cart-summary__checkout');
      if (checkoutBtn) checkoutBtn.disabled = (lines.length === 0);
    }

    // 用 line item 的 key 精确同步（删除后不会因索引错位改错行）
    // /cart/update.js 会返回最新购物车，据此同步内存 + 缓存 + 抽屉（角标与抽屉数据随购物车页改动实时一致）
    async function syncLineByKey(key, qty) {
      const updates = {};
      updates[key] = qty;
      try {
        const res = await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates: updates })
        });
        if (!res.ok) return;
        const cart = await res.json();
        currentCart = cart;
        cacheWrite(cart);
        renderCart(cart); // 刷新右上角角标 + 抽屉内商品数据/小计，保持全局同步
      } catch (e) {}
    }

    function applyQty(lineEl, qty) {
      const input = lineEl.querySelector('[data-qty-input]');
      if (input) input.value = qty;
      if (qty <= 0) {
        const key = lineEl.dataset.key;
        lineEl.remove();
        syncLineByKey(key, 0);
        refreshPageTotals();
      } else {
        const unit = Number(lineEl.dataset.unitPrice) || 0;
        const linePrice = unit * qty;
        lineEl.dataset.linePrice = linePrice;
        const priceEl = lineEl.querySelector('[data-line-price]');
        if (priceEl) priceEl.textContent = money(linePrice);
        syncLineByKey(lineEl.dataset.key, qty);
        refreshPageTotals();
      }
    }

    cartPageEl.addEventListener('click', function (e) {
      const lineEl = e.target.closest('.cart-line');
      if (!lineEl) return;
      const input = lineEl.querySelector('[data-qty-input]');
      let q = parseInt(input.value, 10);
      if (isNaN(q)) q = 0;

      if (e.target.matches('[data-qty-minus]')) {
        applyQty(lineEl, Math.max(0, q - 1));
      } else if (e.target.matches('[data-qty-plus]')) {
        applyQty(lineEl, q + 1);
      } else if (e.target.matches('[data-remove]')) {
        applyQty(lineEl, 0);
      }
    });

    cartPageEl.addEventListener('change', function (e) {
      if (!e.target.matches('[data-qty-input]')) return;
      const lineEl = e.target.closest('.cart-line');
      if (!lineEl) return;
      let q = parseInt(e.target.value, 10);
      if (isNaN(q) || q < 0) q = 0;
      applyQty(lineEl, q);
    });
  }

  /* --- 清空购物车：确认弹窗 → /cart/clear.js → 刷新（服务端已空，全站状态准确） --- */
  const confirmModal = document.querySelector('[data-confirm-modal]');
  let confirmCallback = null;
  function openConfirm(cb) {
    if (!confirmModal) { cb(); return; }
    confirmCallback = cb;
    confirmModal.hidden = false;
    requestAnimationFrame(() => confirmModal.classList.add('is-open'));
  }
  function closeConfirm() {
    if (!confirmModal) return;
    confirmModal.classList.remove('is-open');
    setTimeout(() => { confirmModal.hidden = true; confirmCallback = null; }, 220);
  }
  if (confirmModal) {
    confirmModal.querySelectorAll('[data-confirm-cancel]').forEach(el => {
      el.addEventListener('click', closeConfirm);
    });
    confirmModal.querySelector('[data-confirm-ok]').addEventListener('click', () => {
      const cb = confirmCallback;
      closeConfirm();
      if (cb) cb();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !confirmModal.hidden) closeConfirm();
    });
  }

  document.querySelectorAll('[data-cart-clear]').forEach(btn => {
    btn.addEventListener('click', () => {
      openConfirm(async () => {
        try {
          const res = await fetch('/cart/clear.js', { method: 'POST' });
          const cart = await res.json();
          currentCart = cart;
          cacheWrite(cart); // 先落空车缓存，刷新后未登录秒开也不会回显旧数据
          window.location.reload();
        } catch (e) {
          alert('Failed to clear cart. Please try again.');
        }
      });
    });
  });

  // 产品页 AJAX 加购：拦截表单提交，成功后打开购物车抽屉
  const productForm = document.querySelector('[data-product-form]');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(productForm);
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          // add.js 返回最新购物车，先落本地缓存再打开抽屉，保证新商品立刻显示
          const cart = await res.json();
          currentCart = cart;
          cacheWrite(cart);
          openDrawer();
        } else {
          const err = await res.json();
          alert(err.description || 'Failed to add to cart');
        }
      } catch (err) {
        alert('Error adding to cart. Please try again.');
      }
    });
  }

  /* --- 产品详情页：变体联动 + 图片画廊 + 数量 + Buy Now --- */
  const productPage = document.querySelector('.product-page');
  if (productPage) {
    // 颜色名 -> 色值映射（swatch 显示用）
    const colorMap = {
      black: '#1a1a1a', white: '#ffffff', wood: '#b58954', walnut: '#5c3a21',
      gold: '#d4af37', brown: '#8b5a2b', gray: '#888888', grey: '#888888',
      beige: '#d9c6a5', green: '#2e7d32', blue: '#1565c0', red: '#c62828',
      silver: '#c0c0c0', chrome: '#c0c0c0', nickel: '#9e9e9e', brass: '#b5a642',
      bronze: '#cd7f32', copper: '#b87333', oak: '#c8a97e', ash: '#a89f91',
      natural: '#e8dcc8', cream: '#f5f0e1', ivory: '#fffff0', taupe: '#8b7d6b',
      amber: '#ffbf00', antique: '#8b6f47', darkbrown: '#3e2723', lightbrown: '#a1887f'
    };

    // 解析变体数据 + 变体图片映射
    let variants = [];
    const variantsEl = productPage.querySelector('[data-product-variants]');
    if (variantsEl) { try { variants = JSON.parse(variantsEl.textContent) || []; } catch (e) { variants = []; } }
    let variantImages = {};
    const imagesEl = productPage.querySelector('[data-variant-images]');
    if (imagesEl) { try { variantImages = JSON.parse(imagesEl.textContent) || {}; } catch (e) { variantImages = {}; } }

    const form = productPage.querySelector('[data-product-form]');
    const variantIdInput = productPage.querySelector('[data-variant-id]');
    const priceEl = productPage.querySelector('[data-price]');
    const comparePriceEl = productPage.querySelector('[data-compare-price]');
    const saveBadgeEl = productPage.querySelector('[data-save-badge]');
    const skuEl = productPage.querySelector('[data-sku]');
    const addBtn = productPage.querySelector('[data-add-to-cart]');
    const buyBtn = productPage.querySelector('[data-buy-now]');
    const mainImageWrap = productPage.querySelector('[data-main-image]');
    const optionValueLabels = productPage.querySelectorAll('[data-option-value]');

    // 设置颜色 swatch 背景
    productPage.querySelectorAll('[data-swatch-dot]').forEach(function (dot) {
      const key = (dot.dataset.swatchDot || '').trim().toLowerCase().replace(/\s+/g, '');
      dot.style.backgroundColor = colorMap[key] || '#cccccc';
    });

    // 当前选中 option 值（按 option index）
    const selectedOptions = {};
    productPage.querySelectorAll('[data-option-index]').forEach(function (btn) {
      const idx = btn.dataset.optionIndex;
      if (btn.classList.contains('is-active')) selectedOptions[idx] = btn.dataset.value;
    });

    function findVariant() {
      if (!variants.length) return null;
      const match = variants.find(function (v) {
        return (v.options || []).every(function (val, i) {
          return selectedOptions[i] === undefined || selectedOptions[i] === val;
        });
      });
      return match || variants[0];
    }

    function updateVariantUI() {
      const variant = findVariant();
      if (!variant) return;
      // 价格
      if (priceEl) priceEl.textContent = money(variant.price);
      if (comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          comparePriceEl.textContent = money(variant.compare_at_price);
          comparePriceEl.hidden = false;
          if (saveBadgeEl) {
            const pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
            saveBadgeEl.textContent = 'Save ' + pct + '%';
            saveBadgeEl.hidden = false;
          }
        } else {
          comparePriceEl.hidden = true;
          if (saveBadgeEl) saveBadgeEl.hidden = true;
        }
      }
      // SKU
      if (skuEl) skuEl.textContent = variant.sku || '—';
      // variant id（加购用）
      if (variantIdInput) variantIdInput.value = variant.id;
      // 可用性
      if (addBtn) {
        addBtn.disabled = !variant.available;
        addBtn.textContent = variant.available ? 'Add to cart' : 'Sold out';
      }
      if (buyBtn) buyBtn.disabled = !variant.available;
      // 变体图切换：若该变体有独立图，滑动到对应 slide
      const imgUrl = variantImages[variant.id];
      if (imgUrl && typeof goToSlide === 'function') {
        goToSlide(imgUrl);
      }
    }

    // 变体按钮点击
    productPage.querySelectorAll('[data-option-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = btn.dataset.optionIndex;
        const value = btn.dataset.value;
        selectedOptions[idx] = value;
        productPage.querySelectorAll('[data-option-index="' + idx + '"]').forEach(function (b) {
          b.classList.toggle('is-active', b.dataset.value === value);
        });
        if (optionValueLabels[idx]) optionValueLabels[idx].textContent = value;
        updateVariantUI();
      });
    });

    // ============ 图片画廊：滑动轨道 + 缩略图联动 + 左右箭头 + 放大预览 ============
    const track = productPage.querySelector('[data-gallery-track]');
    const slides = productPage.querySelectorAll('.product-page__gallery-slide');
    const thumbsCol = productPage.querySelector('[data-thumbs-col]');
    const thumbsScroll = productPage.querySelector('[data-thumbs]');
    const thumbBtns = productPage.querySelectorAll('[data-thumb-index]');
    const galleryPrev = productPage.querySelector('[data-gallery-prev]');
    const galleryNext = productPage.querySelector('[data-gallery-next]');
    const zoomBtn = productPage.querySelector('[data-zoom-open]');
    const lightbox = productPage.querySelector('[data-lightbox]');
    const lightboxImg = productPage.querySelector('[data-lightbox-img]');
    const lightboxPrev = productPage.querySelector('[data-lightbox-prev]');
    const lightboxNext = productPage.querySelector('[data-lightbox-next]');
    const lightboxClose = productPage.querySelector('[data-lightbox-close]');

    let currentSlide = 0;
    const slideCount = slides.length;

    // 缩略图列高度同步主图高度（遮罩/滚动与主图对齐）——仅桌面端竖排生效
    function syncThumbsHeight() {
      if (thumbsCol && mainImageWrap) {
        if (window.innerWidth > 900) {
          const h = mainImageWrap.offsetHeight;
          if (h > 0) {
            thumbsCol.style.height = h + 'px';
            thumbsCol.style.maxHeight = h + 'px';
          }
        } else {
          // 移动端缩略图为横排，清除桌面端的高度锁定，用自然高度，
          // 避免在缩略图与标题之间留下大段空白（参考亚马逊）
          thumbsCol.style.height = '';
          thumbsCol.style.maxHeight = '';
        }
      }
    }

    // 让当前缩略图滚动到列中部（竖向/横向自适应）
    function scrollThumbIntoView(idx) {
      if (!thumbsScroll || !thumbBtns[idx]) return;
      const t = thumbBtns[idx];
      const isVertical = window.innerWidth > 900;
      const sSize = isVertical ? thumbsScroll.clientHeight : thumbsScroll.clientWidth;
      const tPos = isVertical ? t.offsetTop : t.offsetLeft;
      const tSize = isVertical ? t.offsetHeight : t.offsetWidth;
      const target = tPos - (sSize / 2) + (tSize / 2);
      thumbsScroll.scrollTo(isVertical ? { top: target, behavior: 'smooth' } : { left: target, behavior: 'smooth' });
    }

    function goToIndex(idx) {
      if (slideCount === 0) return;
      if (idx < 0) idx = slideCount - 1;
      if (idx >= slideCount) idx = 0;
      currentSlide = idx;
      if (track) track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      thumbBtns.forEach(function (t) {
        t.classList.toggle('is-active', Number(t.dataset.thumbIndex) === idx);
      });
      scrollThumbIntoView(idx);
    }

    // 变体切换时按图片 URL 定位 slide（供 updateVariantUI 调用）
    function goToSlide(url) {
      if (!url || !slides.length) return;
      const base = url.split('?')[0];
      for (let i = 0; i < slides.length; i++) {
        const img = slides[i].querySelector('img');
        const src = img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '';
        if (src.split('?')[0] === base) {
          goToIndex(i);
          return;
        }
      }
    }

    if (thumbBtns.length) {
      thumbBtns.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          goToIndex(Number(thumb.dataset.thumbIndex));
        });
      });
    }
    if (galleryPrev) galleryPrev.addEventListener('click', function () { goToIndex(currentSlide - 1); });
    if (galleryNext) galleryNext.addEventListener('click', function () { goToIndex(currentSlide + 1); });

    // 触摸滑动
    let touchStartX = 0, touchStartY = 0;
    if (mainImageWrap) {
      mainImageWrap.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      mainImageWrap.addEventListener('touchend', function (e) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          goToIndex(currentSlide + (dx < 0 ? 1 : -1));
        }
      }, { passive: true });
    }

    // 放大预览 lightbox
    function lightboxShow(idx) {
      const img = slides[idx] ? slides[idx].querySelector('img') : null;
      const src = img ? (img.getAttribute('data-zoom') || img.getAttribute('data-src') || img.src) : '';
      if (lightboxImg) lightboxImg.src = src;
      if (lightbox) {
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';
    }
    function lightboxHide() {
      if (lightbox) {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
    if (zoomBtn) {
      zoomBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        lightboxShow(currentSlide);
      });
    }
    if (mainImageWrap && slideCount > 0) {
      mainImageWrap.addEventListener('click', function (e) {
        if (e.target.closest('[data-gallery-prev]') || e.target.closest('[data-gallery-next]') || e.target.closest('[data-zoom-open]')) return;
        lightboxShow(currentSlide);
      });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', lightboxHide);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { goToIndex(currentSlide - 1); lightboxShow(currentSlide); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { goToIndex(currentSlide + 1); lightboxShow(currentSlide); });
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) lightboxHide();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (lightbox && !lightbox.hidden) {
        if (e.key === 'Escape') lightboxHide();
        else if (e.key === 'ArrowLeft') { goToIndex(currentSlide - 1); lightboxShow(currentSlide); }
        else if (e.key === 'ArrowRight') { goToIndex(currentSlide + 1); lightboxShow(currentSlide); }
      }
    });

    // 同步缩略图列高度
    syncThumbsHeight();
    window.addEventListener('resize', syncThumbsHeight);

    // 首图加载后动态贴合其真实宽高比（避免固定 4:5 比例导致裁切或留白）
    const firstSlideImg = slides.length ? slides[0].querySelector('img') : null;
    if (firstSlideImg && mainImageWrap) {
      const applyAspect = function () {
        if (firstSlideImg.naturalWidth && firstSlideImg.naturalHeight) {
          const ratio = firstSlideImg.naturalWidth / firstSlideImg.naturalHeight;
          // 限制在合理区间，避免极端横/竖图把容器拉得过宽或过高
          if (ratio > 0.3 && ratio < 3.3) {
            mainImageWrap.style.aspectRatio = ratio.toFixed(4);
            syncThumbsHeight();
          }
        }
      };
      if (firstSlideImg.complete && firstSlideImg.naturalWidth) {
        applyAspect();
      } else {
        firstSlideImg.addEventListener('load', applyAspect);
      }
    }

    // 数量 +/- 联动
    const qtyInput = productPage.querySelector('[data-qty-input]');
    const qtyMinus = productPage.querySelector('[data-qty-minus]');
    const qtyPlus = productPage.querySelector('[data-qty-plus]');
    function clampQty() {
      let q = parseInt(qtyInput.value, 10);
      if (isNaN(q) || q < 1) q = 1;
      qtyInput.value = q;
    }
    if (qtyMinus) qtyMinus.addEventListener('click', function () { qtyInput.value = parseInt(qtyInput.value, 10) - 1; clampQty(); });
    if (qtyPlus) qtyPlus.addEventListener('click', function () { qtyInput.value = parseInt(qtyInput.value, 10) + 1; clampQty(); });
    if (qtyInput) qtyInput.addEventListener('change', clampQty);

    // Buy Now：直接结算「当前选中的变体 + 数量」，不合并购物车已有商品
    // 使用 Shopify cart permalink（/cart/{variant_id}:{quantity}）直达 checkout，
    // 只结算 URL 指定的商品，购物车里已有的商品不受影响。
    if (buyBtn) {
      buyBtn.addEventListener('click', function () {
        if (buyBtn.disabled) return;
        const variantId = variantIdInput ? variantIdInput.value : '';
        const qty = Math.max(1, parseInt((qtyInput && qtyInput.value) || '1', 10) || 1);
        if (!variantId) return;
        window.location.href = '/cart/' + variantId + ':' + qty;
      });
    }

    // 初始化（同步默认变体的价格/SKU/可用性）
    updateVariantUI();
  }

  /* --- Header 滚动控制 ---
     不用 sticky（受 announcement-bar 父级影响不稳定），改用 JS：
     1. 滚动超过公告条高度 → header 变 fixed，旁边插占位防止内容跳变
     2. 下滑隐藏、上滑显示 */
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const announcementEl = document.querySelector('.announcement-bar');
    const announcementHeight = announcementEl ? announcementEl.offsetHeight : 0;
    const headerHeight = headerEl.offsetHeight;
    let lastY = window.scrollY;
    let placeholder = null;
    let ticking = false;

    function onScroll() {
      const y = window.scrollY;

      // 1. 滚动超过公告条高度 → 固定 header
      if (y > announcementHeight) {
        if (!headerEl.classList.contains('is-fixed')) {
          headerEl.classList.add('is-fixed');
          // 创建占位，撑起原来 header 的高度
          placeholder = document.createElement('div');
          placeholder.className = 'header-placeholder';
          placeholder.style.height = headerHeight + 'px';
          headerEl.after(placeholder);
        }
      } else {
        if (headerEl.classList.contains('is-fixed')) {
          headerEl.classList.remove('is-fixed');
          if (placeholder) { placeholder.remove(); placeholder = null; }
        }
      }

      // 2. 下滑隐藏，上滑显示
      const diff = y - lastY;
      if (diff > 4 && y > announcementHeight + 50) {
        headerEl.classList.add('header--hidden');
      } else if (diff < -4 || y <= announcementHeight + 50) {
        headerEl.classList.remove('header--hidden');
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });
  }

  /* --- 回到顶部按钮：滚动到一定深度出现，回到顶部隐藏 --- */
  const backToTopBtn = document.querySelector('[data-back-to-top]');
  if (backToTopBtn) {
    const TOP_THRESHOLD = 400;
    let btTicking = false;
    function updateBackToTop() {
      backToTopBtn.classList.toggle('is-visible', window.scrollY > TOP_THRESHOLD);
      btTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (btTicking) return;
      btTicking = true;
      requestAnimationFrame(updateBackToTop);
    }, { passive: true });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Immersive Showcase 滚动动画 --- */
  const immersive = document.querySelector('[data-immersive]');
  if (immersive) {
    const stage = immersive.querySelector('[data-stage]');
    const imageWrap = immersive.querySelector('[data-image-wrap]');
    const overlay = immersive.querySelector('[data-overlay]');
    const card = immersive.querySelector('[data-card]');
    let ticking = false;

    function onScroll() {
      const rect = stage.getBoundingClientRect();
      const windowH = window.innerHeight;
      // 进度：从 stage 顶部进入视口 80% 开始，到 stage 底部到达视口 20% 结束
      const start = windowH * 0.8;
      const end = windowH * 0.2;
      const total = start - end;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / total));

      // 第一段（0~0.5）：宽度从 65% → 100%，圆角从 40px → 0
      const widthProgress = Math.min(1, progress * 2); // 0→0.5 映射到 0→1
      const radius = 40 - (40 * widthProgress);
      imageWrap.style.borderRadius = radius + 'px';
      // 宽度：初始 65%，逐渐到 100%
      const currentWidth = 65 + (35 * widthProgress);
      imageWrap.style.width = currentWidth + '%';

      // 第二段（0.5~1）：暗化遮罩 0→1（白天→夜晚）
      const darkProgress = Math.max(0, Math.min(1, (progress - 0.5) * 2));
      overlay.style.opacity = darkProgress;

      // 第三段（>0.8）：产品卡片淡入
      if (progress > 0.8) {
        card.classList.add('is-visible');
      } else {
        card.classList.remove('is-visible');
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });

    // 初始化
    onScroll();
  }

  /* --- Blog Preview 文章切换（左列表 / 右面板） --- */
  const articleList = document.querySelector('[data-article-list]');
  if (articleList) {
    const panel = document.querySelector('.blog-preview__panel');
    const tabs = articleList.querySelectorAll('[data-article-tab]');
    const contents = panel.querySelectorAll('[data-article-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = tab.dataset.articleTab;
        tabs.forEach(t => t.classList.remove('is-active'));
        contents.forEach(c => c.classList.remove('is-active'));
        tab.classList.add('is-active');
        const target = panel.querySelector('[data-article-panel="' + idx + '"]');
        if (target) target.classList.add('is-active');
      });
    });
  }
})();
