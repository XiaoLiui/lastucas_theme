# LASTUCAS 前端落地记录（Phase 3 · Implementation Notes）

> 版本 v1.0 · 执行人：前端工程师（engineer）
> 上游依赖：`docs/01-brand-visual-spec.md`（视觉 Token / 组件数值）、`docs/02-ux-spec.md`（体验与交互规格）
> 落地范围：`lastucas theme/`（仅允许修改此目录内文件）

---

## 0. 总览

本阶段把 VI 与 UX 规范落到现有 Shopify OS 2.0 主题的真实代码里，按三条主线执行：

- **A. 去 SUNMORY 化**：全局品牌名与命名空间替换为 LASTUCAS。
- **B. 套用视觉 Token**：settings 默认值、`theme.liquid` / `base.css` 注入全量 Token、散落硬编码 hex 替换、核心组件按 VI §7 重写。
- **C. 落地体验规范**：按 UX §7 优先级补齐 Hero 文字、PDP、集合筛选、免运费进度条、焦点管理 / aria、Header 子菜单、首页重排、动效降级等。

所有改动通过 `node --check`（JS）与 `JSON.parse`（所有 `{% schema %}` 与 `templates/*.json`）校验，Liquid 保持合法。

---

## 1. A · 去 SUNMORY 化

- `layout/theme.liquid`：`window.SUNMORY` → `window.LASTUCAS`。
- `assets/theme.js`：顶部注释、命名空间引用、购物车本地缓存 key `lastucas:cart`。
- 全目录大小写不敏感扫描确认 **无残留 `sunmory`**。
- 文案 / 邮箱：`support@sunmory.com` → `support@lastucas.com`；features / main-page / collection-cards / footer 等品牌文案同步改 LASTUCAS。

---

## 2. B · 视觉 Token 落地

### 2.1 settings_schema.json

- 三个色值 default：`color_background = #FAF7F2`、`color_text = #201B15`、`color_accent = #B08A4E`。
- `font_body` default → `figtree_n4`；新增 `font_heading`（default `fraunces_n4`），注入为 `--font-display`。

### 2.2 theme.liquid :root

注入 VI §0 全量 Token（surface/text/accent/wood/border/ink/functional/radius/easing），并补充：

- `--font-display` / `--font-body` 字族栈。
- 语义补充：`--color-text-inverse-secondary`（深底次级 `#B7AC9D`）、`--color-ink-line`（深底分隔 `#3A3228`）。

### 2.3 base.css

- 顶部 `:root` 变量 + `body` 字体切到 `var(--font-body)`。
- 按 VI §2.2 对照表替换散落 hex（`#FFD400`→`--color-accent`、`#e6b800`→`--color-sale`、`#8a7a5a`→`--color-wood`、`#000`→`--color-ink`、`#fff`→`--color-surface`、`#eee/#ccc`→`--color-border`、`#666`→`--color-text-secondary`、`#999`→`--color-text-muted`）。
- 追加「LASTUCAS 品牌覆写」块：按钮三态、PDP CTA、徽章、产品卡（3:4 + hover zoom + 快捷加购）、输入框 focus 外发光、Header（logo 字距 / 导航下划线 / dropdown focus-within）、Hero 文字、信任条、面包屑、星级、短描述、加购错误、手风琴、无货变体禁用、加购 loading、免运费进度条、吸底加购条、集合布局 / 筛选 / bottom sheet / 分页 / 空态、移动端二级菜单、购物车行高亮、footer 深底、testimonial 星级、`prefers-reduced-motion`、skip-link focus。
- 全站统一 focus ring：`outline: 2px solid var(--color-accent-bright)`。

---

## 3. C · 体验规范落地（按 UX §7 优先级）

### 3.1 Hero 文字渲染（最高优先）

`sections/hero.liquid` 重写：每张 slide 渲染 eyebrow / 主标题 / 副标题 / 双按钮（Primary + Outline），文字安全区 ≤50% 宽度，`text_color` 以 inline style 继承每张 slide 的反色设置。

`sections/hero.liquid` + `assets/theme.js` 交互：

- 8s 自动轮播；箭头 / 圆点 / 触摸滑动后**停止自动播放**。
- 键盘 ← → 切换。
- `prefers-reduced-motion` 下禁用自动播放、只显示首屏。
- dots 由 `<span>` 改为 `<button>` + `aria-label`。

### 3.2 PDP 补全

`sections/main-product.liquid` + 新增 snippets：

- `snippets/breadcrumbs.liquid`：Home / Collection / Product。
- `snippets/rating-stars.liquid`：星级 + 评价数（预留接 Reviews / Judge.me）。
- `snippets/product-accordion.liquid`：Description / Specs / Shipping 三组 `<details>` 手风琴；Specs 从 SKU/vendor/type/metafields 出格网。
- `snippets/sticky-add-to-cart.liquid`：移动端吸底加购条（≤768px，滚动越过主 CTA 后出现），价格 + 划线价 + 按钮，用 `form` 属性复用 `#product-form` 提交。
- 表单 `id="product-form"`、inline 错误 `<p data-add-error role="alert">`（`aria-live`）。

`assets/theme.js` PDP 逻辑：

- 加购按钮 loading 态（`.is-loading` + `Adding…` + disabled 防重复提交）。
- 加购失败 inline 错误（替代 `alert()`）；成功后购物车抽屉弹出 + `aria-live` 播报。
- 变体组合可行性预判 `updateAvailability()`：对无匹配 available variant 的 option 加 `aria-disabled` + `.is-unavailable`，且不可点击。
- sticky 吸底条价格 / 划线价 / 按钮随选中变体联动；全售罄显示 `Sold out` disabled。

### 3.3 集合页筛选 + 排序 + 分页

`sections/main-collection.liquid` 重写 + `snippets/collection-filters.liquid`：

- Shopify OS 2.0 原生 storefront filter（`collection.filters`，`filter.v.*` / `filter.p.*`）落 URL query（分享 / 刷新 / 回退保留）。
- 已选 facet 以 chip 展示（可单个 × 移除）+ `Clear all`。
- `history.replaceState` 合并参数，避免返回键困在筛选。
- 移动端 bottom sheet 手风琴 + `Show N results` + `Clear all`。
- 排序保留原生 `<select>`（可访问性）但套输入框样式，改变排序时合并保留筛选参数。
- `paginate by 12`，数字分页 + `Showing X–Y of Z`；空态 `No products match your filters.` + 可操作 `Clear filters`。

### 3.4 免运费进度条

`snippets/free-shipping-bar.liquid`（抽屉 + 购物车页复用）：

- 阈值 `FREE_SHIPPING_THRESHOLD = 15000`（分，即 $150）。
- 未达标 `You're $X away from free shipping.`；达标 `You've unlocked free shipping.`。
- `data-*` 属性供 `assets/theme.js` 的 `updateFreeShippingBar()` 实时更新 fill / 文案 / 完成态。
- 挂载：`layout/theme.liquid` 购物车抽屉底部 + `sections/main-cart.liquid` 小结区。

### 3.5 焦点管理 + aria（全局收口）

新增 `assets/focus-trap.js`：

- `window.LASTUCAS.trapFocus(container)`：Tab 循环、聚焦首个元素、返回 cleanup（焦点归还触发元素）。
- `window.LASTUCAS.setPageInert(active)`：深度计数 inert `#MainContent` / `.announcement-bar` / `.footer` + body 滚动锁（支持嵌套抽屉）。

应用到：移动菜单、搜索抽屉、购物车抽屉、清空确认 modal、集合筛选 bottom sheet、lightbox。全部抽屉补 `role="dialog"` + `aria-modal="true"`，`Esc` 关闭 + 焦点归还。

`layout/theme.liquid` 增加全局 `aria-live="polite"` 播报区；`assets/theme.js` 增 `announce()` 用于加购 / 删除 / 数量变化结果播报。

### 3.6 Header 子菜单 + 移动端二级菜单

`sections/header.liquid`：

- 桌面下拉：`aria-haspopup` + hover / focus 同步 `aria-expanded`。
- 移动端：二级子菜单在每项内原地展开，chevron 旋转，`aria-expanded` 同步。
- schema 背景 default `#FAF7F2`（去纯白）。

### 3.7 首页重排 + 区块挂载

`templates/index.json` 按 UX §2.2 重排：

```
hero → trust-bar → collection-cards → featured-products
→ immersive-showcase → features → usage-scenes → testimonials
→ blog-preview → make-home
```

- 补齐 `trust-bar`（4 项承诺）、`collection-cards`（三大类目入口）、`usage-scenes` 挂载。
- Hero slide 文案改为品牌价值主张（eyebrow / title / subtitle / 双按钮）。

### 3.8 其它 section 改造

- `announcement-bar`：深底 `#1C1712` + ivory 字；默认文案 `Free U.S. shipping on orders over $150 · 30-day returns`。
- `trust-bar`：4 项承诺（免运费 / 30 天退换 / 2 年质保 / 美国仓发货）。
- `features`：文案换 LASTUCAS 卖点；SVG 图标描边换 `--color-wood`，高光点换 `--color-accent`。
- `testimonials`：补星级（新增 `rating` range 设置，`rating-stars` 渲染）。
- `make-home`：补 CTA 按钮（`button_label` / `button_link`）。
- `immersive-showcase`：文案换品牌；`reduced-motion` 下静态展示（theme.js early return）。
- `featured-products` + `snippets/product-card.liquid`：快捷加购（单变体直加、多变体跳 PDP）；卡片 media 结构改为 `<div>` 包裹内链，避免 `<button>` 嵌套在 `<a>` 内。
- `footer`：深底样式（CSS 已覆写）+ 邮箱改 LASTUCAS。
- `main-cart`：挂免运费进度条。

---

## 4. 关键性能与体积预期

- **JS**：`theme.js` 保留原有逻辑，仅增量打补丁；新增 `focus-trap.js`（轻量，约 1KB）独立加载，便于浏览器缓存与复用。未引入任何第三方依赖。
- **CSS**：采用「覆写块」而非全量重写，减少对原主题样式回归面；单文件继续走 Shopify 资源管道压缩。
- **图片**：Hero 首图 `loading="eager"`，其余 `loading="lazy"`；产品卡 / 场景图 `loading="lazy"` + `width` 参数控制尺寸。
- **CWV**：预期 LCP 改善来自 Hero 首屏文字（去空图）+ 首图 eager；CLS 改善来自产品卡固定 3:4 媒体比例、吸底条 / header 占位防跳变；INP 改善来自按钮 loading 防重复提交 + 事件委托（快捷加购）。
- **可维护性**：新增 snippet 单一职责（面包屑 / 星级 / 手风琴 / 吸底条 / 进度条 / 筛选面板），复用面清晰。

---

## 5. 验证方式

1. **JSON / 语法**：
   ```bash
   node --check assets/theme.js assets/focus-trap.js
   node -e "JSON.parse(require('fs').readFileSync('templates/index.json','utf8'))"
   # 全部 section schema 与 templates/*.json 已脚本校验通过
   ```
2. **去品牌化扫描**：`grep -rni sunmory "lastucas theme/"` 应无输出。
3. **Shopify 预览**：`shopify theme dev` 本地预览，重点走通首页 → 集合筛选 → PDP 加购 → 抽屉免运费进度 → 购物车页。
4. **手动回归清单**：
   - Hero 自动轮播 8s、交互后停止、键盘切换、reduced-motion 静帧。
   - PDP：变体组合禁用态、loading 态、inline 错误、吸底条联动、面包屑 / 星级 / 手风琴。
   - 集合页：筛选 chip / clear all / 排序保留参数 / bottom sheet / 空态一键清除。
   - 抽屉 / modal：Tab 陷阱、Esc 关闭、焦点归还、背景 inert。
   - 移动端：二级子菜单展开、产品卡快捷加购（单变体直加 / 多变体跳 PDP）。
5. **A11y**：键盘走查 + 读屏验证 `aria-live` 播报与 `aria-expanded` / `aria-disabled` 状态。

---

## 6. 已知边界（供后续迭代）

- `usage-scenes` 依赖 `product.metafields.custom.usage_scenes` 或 `shop.metaobjects.usage_scene`；首页无 `product` 对象，会走全局 metaobject 兜底，若无配置则整块不渲染（受 `{% if scenes.size > 0 %}` 保护，不产生空壳）。
- 评价数据为静态默认（`4.8 · 1,234 reviews` / testimonial 星级），正式接 Reviews / Judge.me 时替换 `rating-stars` 数据源即可。
- 免运费阈值为 UX 默认 $150，改 `FREE_SHIPPING_THRESHOLD` 常量即可。
- `base.css` 中 `#856433`（Primary active）为 VI §7.1 规范指定值，无对应 Token，按字面保留。

---

## 7. v2.0 暗调灯廊落地（Phase 3' · Dark Gallery）

> 依据 `docs/01-brand-visual-spec.md` v2.0，仅改视觉（配色/字体/圆角/组件深浅），未动页面结构、section 顺序、JS 交互逻辑、schema 字段结构。

### 7.1 Token 全量替换

`layout/theme.liquid` 与 `assets/base.css` 两处 `:root` 同步切换为 v2.0 暗调：

- 表面：`bg #1C1712` / `bg-alt #292219` / `surface #262019` / `surface-hover #2E2A24`。
- 文字：`text #F3EEE5` / `secondary #B7AC9D` / `muted #8E8478` / `text-inverse #1C1712`（金色按钮深字）。
- 强调：`accent #C7A05C` / `accent-strong #B08A4E` / `accent-soft rgba(199,160,92,.14)` / `accent-bright #E0BE85`。
- 边框：`border #3A3228` / `border-strong #4A4033`；`ink #0F0C09`（仅遮罩/阴影）、`ink-soft #292219`。
- 功能色全部换深底适配值（success/error/warning/info/sale/soldout）。
- 新增 `--color-focus #E0BE85`。

**语义坑修复**：`--color-ink` 与 `--color-text-inverse` 语义反转后，把原「深底表面」引用改为 `--color-bg` / `--color-bg-alt`，`--color-ink` 仅保留给抽屉/弹层遮罩、hero 遮罩、immersive 暗化层、mask-image；`--color-text-inverse` 仅用于金底/陶土徽章上的深字。

### 7.2 字体全无衬线 Inter

- `settings_schema.json`：`font_body → inter_n4`、`font_heading → inter_n6`。
- `--font-display` 更名 `--font-heading`（Inter），`--font-body`（Inter）；全文 `var(--font-display)` 引用同步改名。
- 字号阶梯：display 72/600、h1 48、h2 34、h3 26；标题 `h1,h2` 全大写 + ls 0.05em；hero 标题全大写 + ls 0.04em；价格 `tabular-nums`。
- grep `fraunces`（忽略大小写）= 0。

### 7.3 圆角收敛锐利直角

- Token：`--radius-xs 2px / sm 4px / md 8px / lg 12px / full 999px`（移除 pill/xl）。
- 按钮/输入框/缩略图 → 4px；徽章/chip → 2px；产品卡 → 8px；大媒体框/特性卡 → 12px；仅色板圆点/分页点/头像保留圆角。
- 原主题残留的胶囊按钮（999px）与 24/20/40px 大圆角经覆写块收敛；grep `--radius-pill|--radius-xl` 引用 = 0。

### 7.4 组件深底化

- Header/Footer/抽屉面板深底 `--color-bg`；announcement bar `--color-ink` + `#B7AC9D`。
- 产品卡 `--color-surface` + 1px `--color-border` + 硬阴影；输入框 `--color-bg-alt` + `--color-border-strong`。
- Primary 香槟金底 + 深字；Outline 暖白描边；禁用态深底 muted。
- 焦点环统一 `--color-focus`；金底元素自身聚焦用暖白焦点环（避免金上金）。
- 抽屉/弹层遮罩 `rgba(15,12,9,0.7)`（= `--color-ink` #0F0C09 @70%）。

### 7.5 散落浅色值清理

- `hero.liquid` schema `text_color` default `#FFFFFF → #F3EEE5`；`index.json` 两张 slide `text_color` → `#F3EEE5`。
- `header.liquid` `bg_color` default `#FAF7F2 → #1C1712`；`announcement-bar` 默认 `#0F0C09`/`#B7AC9D`。
- `features.liquid` 图标描边/高光 → 香槟金 `#C7A05C`（界面强调，非材质色）。
- `featured-products.liquid` 兜底色板 → 胡桃 `#8A674A`/黑 `#0F0C09`/香槟金 `#C7A05C`。
- 全目录 grep `#FAF7F2` / `#F2EDE5` / `#FFD400` = 0；grep 旧 accent hex 无残留（`:root` 内 `--color-accent-strong #B08A4E` 为 v2.0 规范值，保留）。

### 7.6 自检结果

- `node --check assets/theme.js` / `assets/focus-trap.js` 通过。
- 全部 8 个 templates/*.json + settings_schema.json + 23 个 section schema `JSON.parse` 通过。
- grep `fraunces` = 0；`#FAF7F2`/`#F2EDE5`/`#FFD400` = 0；`var(--radius-pill|xl)`、`--font-display`、`color: var(--color-surface|bg)`、`border-color: var(--color-text)` 引用均清零。

### 7.7 遗留说明

- `assets/theme.js` 中 `colorMap`（变体色名 → 材质 swatch 色）属数据映射，非 UI 语义色，按「不动 JS 逻辑」原则保留。
- `base.css` 原主题内少量 `rgba(255,255,255,0.9)`（hero 箭头底色）为图片上方的独立控件，深图可读，未强制替换。
