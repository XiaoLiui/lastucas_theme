# LASTUCAS 官网体验与交互规范（UX Spec · Phase 2）

> 版本 v1.0 · 状态：可交付前端直接落地
> 适用范围：Shopify DTC 官网（全英文站点 / 美国市场）
> 上游依赖：`docs/01-brand-visual-spec.md`（视觉 Token、字号、间距、组件视觉基调，本文不重复定义，只在其上补「交互与信息架构」）
> 目标用户：美国中产家庭家居消费者（女性为主，注重家居美学与品质感）

**本文与视觉规范的关系**：本文所有色值/字号/间距/圆角/组件视觉形态一律引用 `01-brand-visual-spec.md` 的 Token（`--color-accent` `#B08A4E`、`--font-display` Fraunces、`--sp-*` 24px 节奏、容器 1200px、产品卡 3:4、PDP 左图右信息 sticky、购物车抽屉 400px 等）。本文只定义**页面结构、交互触发/状态/反馈/异常、响应式断点、无障碍与信任要素摆放**。

---

## 1. 信息架构（IA / Sitemap）

### 1.1 整站页面层级

```
LASTUCAS DTC 官网
│
├── 首页 /                                  ← 核心路径 · 必做
├── 集合页（Collection）
│   ├── /collections/all                     ← 核心路径 · 必做（Shop All）
│   ├── /collections/floor-lamps             ← 必做（主类目）
│   ├── /collections/arc-floor-lamps         ← 必做（细分入口）
│   ├── /collections/torchiere-floor-lamps   ← 必做（细分入口）
│   └── /collections/floor-lamps-with-shelves← 必做（细分入口）
├── 商品详情页（PDP）/products/{handle}        ← 核心路径 · 必做
├── 购物车页 /cart                            ← 核心路径 · 必做
├── 结账（Shopify 托管 checkout）             ← 系统托管，仅保证跳转正确
├── 账户 /account（登录/注册/订单/地址）        ← 后续迭代
├── 关于 /pages/about-us                      ← 后续迭代
├── 博客 /blogs/journal + 文章                 ← 后续迭代（内容/SEO 支撑）
├── FAQ /pages/faq                            ← 后续迭代
├── 联系 /pages/contact                       ← 后续迭代
├── 政策页：Shipping / Returns / Warranty / Privacy / Terms  ← 后续迭代（Footer 需挂链接）
└── 404 / 404                                 ← 后续迭代（有 main-404 兜底）
```

**本阶段核心路径（必做）**：
`首页 → 集合页 → 商品详情页 → 购物车页 → 结账`，以及贯穿全程的全局组件（Announcement bar / Header / 移动端菜单 / 搜索抽屉 / 购物车抽屉 / Footer）。其余页面保留结构但不做体验精修。

### 1.2 全局导航结构（Header 主菜单）

| 一级 | 二级（下拉） | 说明 |
|---|---|---|
| Shop | All Floor Lamps / Arc Floor Lamps / Torchiere / With Shelves | 主转化入口，放第一位 |
| Collections | 同 Shop 的细分集合（可按品牌故事分组） | 与 Shop 可合并，避免重复 |
| Our Story | About / Craftsmanship | 品牌信任 |
| Journal | 博客列表 | 内容/SEO |

- 主导航**最多 4 个一级项**，超过会稀释高级感与转化效率。
- 「Shop」为默认高亮态；移动端菜单按同一树结构展开子菜单（当前 theme 的二级菜单未实现，见 §7 新增项）。

---

## 2. 首页内容编排

> 目标：3 秒内让用户看懂「你是谁、卖什么、为什么值得买」，并给出清晰的第一点击路径。

### 2.1 首页首屏价值主张（3 秒）

- **Eyebrow（眉题）**：`FLOOR LAMPS · CRAFTED IN SMALL BATCHES`（`--fs-eyebrow`，黄铜/木色）
- **Display 主标题**：`Timeless floor lamps, cast in warm light.`（Fraunces 64px，暖炭黑或深底反色）
- **副标题**（一句话）：`Solid walnut and brushed brass, designed to make every evening feel considered.`（18px secondary，max-width 520px）
- **双按钮**：Primary `Shop Floor Lamps`（→ `/collections/floor-lamps`）+ Outline `Our Story`（→ `/pages/about-us`）
- **主视觉**：开灯的暖光场景（暗调 `#1C1712` 场景优先，灯为唯一光源），文字安全区 ≤ 50% 宽度。

### 2.2 首页区块顺序（从上到下，含目标与映射）

| # | 区块 | 目标 | 对应现有 section | 动作 |
|---|---|---|---|---|
| 1 | Announcement bar | 免运费 + 退换承诺，一进入就建立信任 | `announcement-bar` | 改造（改文案/改深底） |
| 2 | Header | 导航 + 搜索 + 购物车入口 | `header` | 改造（补子菜单/a11y） |
| 3 | **Hero** | 3 秒价值主张 + 第一 CTA | `hero` | **改造（必须渲染文字/按钮）** |
| 4 | Trust bar | 4 项承诺（免运费/30 天退换/2 年质保/美国仓发货）横向信任条 | `trust-bar` | 改造文案 + 挂载到 index.json |
| 5 | Collection cards | 三大类目入口（Arc / Torchiere / With Shelves），降低选择成本 | `collection-cards` | 保留 + 挂载到 index.json |
| 6 | Featured products | 爆款/热销 4 张产品卡，支持快捷加购 | `featured-products` | 改造（补快捷加购） |
| 7 | Immersive showcase | 「光品质」故事：白天→夜晚→灯亮，建立情感共鸣 | `immersive-showcase` | 改造（文案 + reduced-motion 降级） |
| 8 | Features（Why） | 品牌差异化 6 点（工艺/发货/质保/退换等） | `features` | 改造（文案换 LASTUCAS） |
| 9 | Usage scenes | 场景共鸣（客厅/卧室/阅读角），强化「适配我的家」 | `usage-scenes` | 保留（从 PDP 复用，可挂首页） |
| 10 | Testimonials | 社交证明（真实评价 + 星级 + 作者） | `testimonials` | 改造（补星级/来源） |
| 11 | Blog preview | 内容与 SEO 支撑（非转化关键，放中后段） | `blog-preview` | 保留 |
| 12 | Make Home CTA | 情感收尾 + 二次指向集合页 | `make-home` | 改造（补 CTA 按钮） |
| 13 | Footer | 导航兜底 + 订阅 + 政策链接 | `footer` | 改造（深底 + 品牌文案） |

> 现有 `index.json` 顺序为 `hero → featured → immersive → why → testimonials → blog → makehome`，**缺少 trust-bar 与 collection-cards**，需重排为上述顺序并补齐缺失区块。

### 2.3 首页区块的关键交互要求

- **Hero**：最多 3 张 slide；自动轮播 8s，任何用户交互（箭头/圆点/触摸滑动）后**停止自动播放**；`prefers-reduced-motion` 下禁自动播放、只显示首屏。当前 `hero.liquid` 只渲染了图片，**必须补齐 eyebrow/title/subtitle/双按钮的渲染**（否则首屏价值主张丢失）。
- **Product card 快捷加购**：卡片 hover 时底部淡入 `Add to Cart`（单变体商品直接加购；多变体商品跳转 PDP 选款）。移动端无 hover，改为卡片右下角常驻一个小圆加购按钮（触控可达 44px）。
- **Featured products / 首页产品网格**：4 列（desktop）/ 3 列（1024）/ 2 列（768 与移动）。

---

## 3. 关键交互流程（逐条交互规格）

> 每条按 **触发 → 状态变化 → 反馈 → 边界/异常** 四段描述。数值引用视觉规范 Token。

### 3.1 变体选择（PDP 色板/款式）

**触发**：用户点击某个 option 按钮（色板 swatch / 尺寸款式按钮）。

**状态变化**：
- 当前 option 组内点击项变为选中态（色板：外圈 2px `--color-accent` 描边 + 右下小对勾图标；款式按钮：实心 `--color-accent` 底 + ink 文字）。
- 选中项文案回填到标签行 `Color: <当前值>`（`data-option-value`）。
- 价格 / 划线价 / Save 徽章 / SKU / 加购按钮可用性 / 主图 全部随选中变体联动（当前 theme.js 已实现，保留）。
- 若选中变体有独立 featured image，主图滑动到对应 slide（已实现）。

**反馈**：
- 选中态即时高亮；价格数字若变化，加 150ms 过渡（视觉上「数字跳动」用克制的 fade，不做弹跳）。

**边界/异常**：
- **无货变体禁用态（必须新增）**：当用户已选「颜色 A」，其余 option 组中与 A 组合后无库存的值应显示为「不可用」——`aria-disabled="true"` + 视觉禁用（色板 40% 透明度 + 斜杠横线；款式按钮 muted 描边），**且不可点击**，避免选到一半才被告知售罄。实现方式：前端读取 `data-product-variants`，在每次选择后做一次「组合可行性」预判，对无匹配 available variant 的选项加禁用态。
- 全部变体售罄：主 CTA 显示 `Sold out` 且 `disabled`（已实现），同时隐藏 `Buy Now`，吸底加购条也显示 Sold out。
- 只有一个 option（如仅颜色）时同样适用上述禁用逻辑。

### 3.2 加购流程（PDP）

**触发**：用户在 PDP 点击 `Add to Cart`（Primary 按钮，max-width 420px）。

**状态变化**：
1. 提交 `form[data-product-form]`，走 `POST /cart/add.js`（AJAX，已实现）。
2. 按钮进入 **loading 态**：按钮文案变为 spinner + `Adding…`，`disabled` 防止重复提交（当前缺失，需新增）。
3. 成功后更新全局购物车状态（内存 + localStorage 缓存，已实现）。

**反馈**：
- **主反馈 = 购物车抽屉自动弹出**（已实现，保留）。抽屉打开即等于「已加入」的确认，比 toast 更符合转化导向（用户立刻看到商品 + 结账路径）。
- 抽屉内新增行短暂高亮（新加的商品行背景 1.5s 从 `--color-accent-soft` 淡回透明）。
- Header 购物车角标数量 +1（已实现，按「行数」计数）。

**边界/异常**：
- 加购失败（网络/库存）：按钮恢复 `Add to Cart`，用**非阻塞 inline 错误提示**（按钮上方 12px `--color-error` 文字，`aria-live="polite"`）替代当前 `alert()`；库存不足时文案 `This item is no longer available in that quantity.`。
- 数量为 0 或非法：`clampQty` 强制回 1（已实现）。
- `Buy Now`：走 Shopify cart permalink `/cart/{variant_id}:{qty}` 直达 checkout（已实现，保留）；该按钮永不进入 loading 态（直接跳转）。

### 3.3 购物车抽屉（Cart Drawer）

**触发**：点击 Header 购物车图标 / 加购成功自动弹出。

**状态变化**：
- 抽屉右滑入（300ms，`--ease-in-out`），宽 400px（mobile 全宽），覆盖层半透明 `--color-ink` 40% 遮罩，背景 `scroll` 锁定。
- 打开时拉取 `/cart.js` 同步（未登录先用 localStorage 秒开，已实现）。

**反馈与内部状态**：
- **空态**：`Your cart is empty` + `Continue shopping`（→ `/collections/all`）+ `Have an account? Log in`；同时显示「You may also like」推荐（已实现，保留）。
- **有货态**：
  - 顶部：标题 `Cart (N)` + 清空按钮（点击弹确认 modal，已实现）。
  - **免运费进度条（必须新增）**：高 4px，轨道 `--color-border`，已达成 `--color-accent`；上方 12px 文案。阈值 `FREE_SHIPPING_THRESHOLD`（分）建议设为 **$150（15000 分）**，未达标显示 `You're $X away from free shipping.`，达标显示 `You've unlocked free shipping.`。若业务最终选择全场免邮，则固定显示 `Free shipping on all orders.` 并隐藏进度条（进度条仅在「有门槛」时展示才有意义）。
  - 行项目：缩略图 96px → 标题 14px → 变体 → 价格 14px → 数量步进器 32px → Remove 12px muted。
  - 数量修改：乐观更新（本地立即变 + 后台 `/cart/change.js` 同步，已实现）；输入框 `change` 或步进器 ± 触发。
  - 底部：Total + 税费说明 + 可选订单备注 + `View cart`（outline）+ `Checkout`（Primary 全宽）。
- **删除**：行淡出移除，小计与角标同步（已实现）。

**边界/异常**：
- `Esc` 关闭（已实现）；点击遮罩关闭；关闭后**焦点归还到触发元素（购物车按钮）**（需新增焦点管理，见 §5）。
- 清空购物车走确认 modal（已实现），确认文案 `Clear your cart?` / 不可撤销提示。
- 抽屉打开时背景内容 `inert`（不可聚焦/读屏不遍历）。

### 3.4 集合页筛选 + 排序 + 分页

**触发**：进入 `/collections/*`；点击筛选组；选择排序；翻页。

**状态变化与反馈**：
- **排序（Sort）**：保留原生 `<select>`（可访问性最好），但**视觉套用输入框样式**（48px、圆角 10px、边框 `--color-border`）。选项：Featured / Price Low→High / Price High→Low / Name A–Z / Newest（已实现，仅换样式）。
- **筛选（Filter，必须新增，当前完全缺失）**：采用 Shopify OS 2.0 原生 storefront filter（`filter.v.*` / `filter.p.*`），落地为 URL query 参数以支持分享/回退/刷新保留。Facet 建议（落地灯相关）：
  - Price（区间滑杆或分段）
  - Finish（Brass / Walnut / Black / Nickel / Antique）——色板样式
  - Height（Short / Mid / Tall 分段）
  - Features（Dimmable / USB Charging / With Shelves / Remote Control）
  - Availability（In stock）
- **筛选状态保留**：所有已选 facet 以「chip」形式显示在结果区顶部（可单个 × 移除），并提供 `Clear all`。刷新/返回保留（URL 参数 + `history.replaceState`，不新增历史记录条目避免返回键困在筛选里）。
- **移动端筛选面板**：底部滑出的 bottom sheet，分组手风琴，底部固定 `Show N results`（Primary 全宽）+ `Clear all`。打开时显示「已选 N 项」。
- **分页**：`paginate by 12`；桌面/移动统一用「数字分页 + `Showing X–Y of Z`」；结果为空显示空态 `No products match your filters.` + `Clear filters` 按钮（当前空态文案需强化为可操作）。

**边界/异常**：
- 筛选组合无结果：空态 + 一键清除，不静默空屏。
- 排序改变时保留当前筛选参数（URL 合并，不覆盖 filter）。
- 无货商品默认仍在列表但标记 Sold out 徽章；「In stock」facet 开启后过滤。

### 3.5 移动端菜单与搜索

**移动端菜单（hamburger）**：
- **触发**：点击汉堡图标（`aria-expanded` 切换，已实现）。
- **状态变化**：左侧滑入抽屉（全高，宽 ≤ 85%）；一级项竖向列表。
- **子菜单（必须新增）**：当前仅有 `›` 箭头但无展开行为。新增：点击带子级的一级项（或箭头）→ 子列表**在原抽屉内下推展开**（chevron 旋转 90°），或进入第二层抽屉（推荐「原地展开」更简单，层级 ≤ 2）。
- **反馈**：当前页一级项高亮；关闭后焦点归还汉堡按钮。

**搜索抽屉（已实现，需补焦点管理）**：
- **触发**：点击 Header 搜索图标。
- **状态变化**：抽屉滑入，输入框自动聚焦（300ms 后，已实现）。
- **反馈**：输入防抖 300ms → `search/suggest.json` 全量搜索（product/collection/page/article，limit 3，已实现）；loading spinner；结果分组（Products / Collections / Pages / Articles）+ 底部 `View all results`。
- **空输入**：显示 `Trending Now`（热门产品，已实现）。
- **边界/异常**：无结果显示 `No results found.`；请求失败显示 `Search failed. Please try again.`（已实现）。`Esc` 关闭 + 焦点归还搜索按钮（需新增）。移动端键盘「搜索」键提交表单跳转 `/search?q=`。

### 3.6 Header 滚动行为

**触发**：页面滚动。

**状态变化**（当前 theme.js 已实现，保留并规范化）：
1. 滚动超过 announcement bar 高度 → Header `fixed` + 插入占位 div 防内容跳变。
2. 下滑 > 4px 且超过阈值 → Header 上滑隐藏（`translateY(-100%)`，150ms）；上滑或回到顶部 → 显示。
3. 购物车角标随购物车状态实时更新（已实现，按行数计，0 时隐藏）。

**反馈**：隐藏/显示用 150ms `--ease-out` 过渡，不做回弹。

**边界/异常**：
- 抽屉/弹层打开时暂停 Header 隐藏逻辑（避免抽屉开着 header 消失）。
- `prefers-reduced-motion` 下禁用隐藏动画（只保留 fixed 与直接显示/隐藏）。
- 焦点不可落在被隐藏的 Header 内（隐藏时其中的可聚焦元素 `visibility:hidden`/`inert`）。

---

## 4. 响应式断点

| 断点 | 关键布局变化 |
|---|---|
| **≥ 1025px（Desktop）** | 主导航完整展示（4 项）；汉堡隐藏；产品网格 4 列；PDP 两栏 55/45（左图 sticky + 缩略图竖排）；购物车抽屉 400px；Hero 16:9 |
| **1024–769px（Tablet/Laptop）** | **导航折叠为汉堡（≤1024 即折叠）**；产品网格 3 列；PDP 保持两栏但信息区比例可放宽到 50/50；缩略图改横排；gutter 32px；section padding 64px |
| **768–481px（Mobile）** | 产品网格 2 列（缩槽 gutter 16px）；PDP 上下堆叠（图在上、信息在下，**sticky 失效**）；**吸底加购条出现**；Header 高 64px；gutter 24px；section padding 48px |
| **≤ 480px（Small Phone）** | 产品网格保持 2 列（更小槽）；信任卡/特性卡单列堆叠；所有触控目标 ≥ 44px；标题字号按视觉规范移动端缩放（display 40 / h1 34 / h2 28 / h3 24） |

**PDP 吸底加购条（mobile ≤768px，必须新增）**：
- 条件：当用户滚动越过页面内「Add to Cart」按钮后出现（或始终显示——推荐「越过主 CTA 后出现」，避免首屏信息冗余）。
- 内容：左侧价格（当前选中变体价 + 划线价），右侧 Primary `Add to Cart`（全宽或 ≥50% 宽）。
- 高度 64px + `env(safe-area-inset-bottom)`；变体售罄时显示 `Sold out` disabled。
- 加购逻辑与主 CTA 完全一致（同一表单提交），成功后抽屉弹出。

---

## 5. 无障碍（WCAG 2.1 AA）

### 5.1 键盘可达
- 所有可交互元素用原生语义元素（`<button>` / `<a>` / `<select>` / `<input>`），不拦截 Tab 键。
- 全站焦点环统一：`outline: 2px solid #C7A05C; outline-offset: 2px`（`--color-accent-bright`），不 `outline:none` 除非同时给等价 focus 样式。
- 轮播（Hero / PDP 画廊 / usage-scenes / lightbox）：左右方向键切换（lightbox 已实现，其余需补）。
- Tab 组件（usage-scenes）：`role="tablist/tab/tabpanel"` + 方向键移动 + `aria-selected`（已具备基本结构，补方向键）。

### 5.2 焦点管理（抽屉/弹层开合）
- **所有抽屉/弹层**（移动菜单 / 搜索 / 购物车 / lightbox / 确认 modal）：
  - 打开：焦点移入面板第一个可聚焦元素（或关闭按钮）；`role="dialog"` + `aria-modal="true"`。
  - 期间：**焦点陷阱（focus trap）**——Tab 在面板内循环，背景 `inert`。
  - 关闭：焦点归还到**触发元素**（汉堡/搜索/购物车按钮）。
  - `Esc` 关闭。
- 现有实现只有 `aria-hidden` 切换，缺 focus trap 与焦点归还，**需新增一个通用 focus-trap 工具函数**复用。

### 5.3 ARIA 标签
- 图标按钮：`aria-label`（Search / Account / Cart / Menu / Close 等，多数已具备）。
- 汉堡按钮：`aria-expanded` 随开合切换（已实现）。
- 色板/款式按钮：`aria-label` = `"{Option name}: {value}"` + 可用性；选中态用 `aria-pressed="true"`（或 `aria-selected`）。
- 购物车角标：`aria-label="Cart, N items"`（或配 `aria-live="polite"` 让读屏播报数量变化）。
- 加购/删除/数量变化结果：`aria-live="polite"` 区域播报（如「已加入购物车」「商品已移除」），不依赖视觉。

### 5.4 对比度（关键项）
- 正文文字对背景 ≥ 4.5:1；大字（≥24px 或 ≥18.66px 加粗）≥ 3:1。
- 已知达标：`#1C1712` on `#B08A4E` ≈ 5.6:1（Primary 按钮）；`#6E6559` on `#FAF7F2` ≈ 5.2:1（次级文字）；`#201B15` on `#FAF7F2` 高对比。
- **需警惕**：`--color-text-muted` `#A1988B` on 暖白 ≈ 2.6:1，**仅限**大字号/装饰/禁用态，不得用于正文关键信息；深底 Footer 次级文字用 `#B7AC9D`（对比度需 ≥4.5:1）。
- 色弱：选中色板不能只靠颜色区分（用描边 + 对勾双重信号）；Sale 价格除颜色外保留划线价语义。

### 5.5 动效降级 `prefers-reduced-motion`
- 关闭：Hero 自动轮播、卡片 hover 缩放、滚动 fade-up、immersive 滚动动画、抽屉滑动、Header 隐藏动画；所有内容直接呈现，动效时长归零。

### 5.6 Skip-link 与语义
- 现有 `.skip-link` → `#MainContent` 已具备，确保 `:focus` 时可见（非仅 `visually-hidden`）。
- 页面标题层级：每页唯一 `h1`；区块 `h2`；卡片 `h3`。
- 表单错误：`aria-invalid="true"` + 错误文字 `id` 通过 `aria-describedby` 关联输入框，错误区 `aria-live="polite"`。

---

## 6. 内容与信任要素

### 6.1 免运费门槛
- 首页/全站 Announcement bar：`Free U.S. shipping on orders over $150 · 30-day returns`。
- 购物车抽屉 + 购物车页：进度条文案（见 §3.3）。阈值 `$150` 为 UX 默认，业务可改，改 `FREE_SHIPPING_THRESHOLD` 常量即可。

### 6.2 退换 / 质保 / 发货
- PDP 信任行（信息区价格下方，13px 图标行）：`Free shipping over $150` / `30-day easy returns` / `2-year warranty`。
- PDP 信任卡（现有 4 卡，保留并统一文案）：`30-Day Easy Returns` / `Fast & Free Shipping` / `Ships from U.S. Warehouse` / `2-Year Warranty`。
- 这些承诺**必须在加购按钮附近**（紧邻 CTA），是转化前的最后一道信任强化。

### 6.3 社交证明（评价）
- **PDP 标题下方补评分行（必须新增）**：星级（`--color-accent-bright`）+ `4.8 · 1,234 reviews` + 锚点链接跳转到评价区（后续接入 Shopify Reviews / Judge.me 时替换）。
- 首页 Testimonials：每条补星级 + 作者 + 日期（现有有作者/日期，缺星级）；文案选「易组装 / 遥控调光 / 收纳充电」等与卖点强相关的真实评价。
- 基调：真实、克制、口语化，避免「!!!」「BEST EVER」式夸张；评价放转化路径的**中后段**（首页靠后、PDP 信息区顶部 + 页尾）。

### 6.4 文案基调
- 句子大小写（`Add to Cart` 而非 `ADD TO CART`），仅 eyebrow/徽章可全大写。
- 避免「50% OFF 倒计时」式促销腔；用「价值 + 信任」替代「折扣 + 紧迫」。

---

## 7. 待改造清单（对照现有 section，给前端落地）

> 文件均位于 `lastucas theme/` 下。

### 7.1 保留（结构/逻辑已可用，仅套用视觉 Token）

| 文件 | 说明 |
|---|---|
| `snippets/product-card.liquid` | 产品卡结构、徽章、色板、价格逻辑完整；补「快捷加购」与 hover 交互 |
| `sections/collection-cards.liquid` | 类目大卡结构完整；需挂载进 index.json |
| `sections/testimonials.liquid` | 评价结构完整；补星级 |
| `sections/blog-preview.liquid` | 保留，位置靠后 |
| `sections/main-search.liquid` | 搜索结果页逻辑完整 |
| `sections/make-home.liquid` | 保留；补 CTA 按钮 |
| `sections/usage-scenes.liquid` | 场景切换完整；补方向键 a11y，可复用挂首页 |
| `assets/theme.js` 核心逻辑 | 购物车乐观更新、变体联动、画廊、Header 滚动、清空确认均已实现 |

### 7.2 改造（结构在，需补功能或重排）

| 文件 | 改造点 |
|---|---|
| `sections/announcement-bar.liquid` | 默认文案/配色改为「免运费 + 退换」深底（当前 `#FFD400` 荧光黄需换成 `--color-ink` 底 + ivory 字） |
| `sections/header.liquid` | 补下拉菜单 `aria-expanded`/键盘交互；移动端二级子菜单展开；焦点管理 |
| `sections/hero.liquid` | **必须渲染 eyebrow/title/subtitle/双按钮**（当前只渲染图片）；补停自动播放/键盘/`reduced-motion` |
| `sections/main-product.liquid` | 补面包屑、短描述、星级评分行、Description/Specs/Shipping 三组手风琴、无货变体禁用态、加购 loading 态与 inline 错误、吸底加购条 |
| `sections/main-collection.liquid` | **补筛选（filter）面板 + 状态保留 + 清除**；排序套样式；分页强化 + 空态可操作；移动端筛选 bottom sheet |
| `sections/main-cart.liquid` | 补免运费进度条；小结区与抽屉风格统一 |
| `sections/featured-products.liquid` | 补快捷加购；文案/标题改 LASTUCAS 调性 |
| `sections/features.liquid` | 文案从「SUNMORY/50% Off」换成 LASTUCAS 品牌卖点；图标描边色换 `--color-wood` |
| `sections/immersive-showcase.liquid` | 文案换品牌；`reduced-motion` 下静态展示 |
| `sections/footer.liquid` | 深底 `--color-ink` 化；邮箱 `support@sunmory.com` → `support@lastucas.com`；订阅成功反馈 `aria-live` |
| `sections/trust-bar.liquid` | 文案统一为 4 项承诺；挂载进 index.json |
| `templates/index.json` | 重排区块顺序 + 补 trust-bar / collection-cards / usage-scenes |
| `templates/collection.json` | 如需在集合页挂侧栏筛选 section，则增加挂载 |
| `layout/theme.liquid` | 购物车抽屉/搜索抽屉补 focus trap 与焦点归还；抽屉 `aria-modal`；补 `aria-live` 区域 |

### 7.3 新增（需新建文件）

| 新文件 | 用途 |
|---|---|
| `snippets/free-shipping-bar.liquid` | 可复用免运费进度条（抽屉 + 购物车页共用） |
| `snippets/breadcrumbs.liquid` | PDP/集合页面包屑 |
| `snippets/rating-stars.liquid` | 星级 + 评价数（预留接评价插件） |
| `snippets/product-accordion.liquid` | Description / Specs / Shipping 手风琴 |
| `snippets/sticky-add-to-cart.liquid` | PDP 移动端吸底加购条 |
| `sections/collection-filters.liquid` | 集合页筛选面板（桌面侧栏 + 移动 bottom sheet） |
| `assets/focus-trap.js`（或并入 theme.js） | 通用焦点陷阱/归还工具，供所有抽屉/弹层复用 |
| `assets/reduced-motion.js`（或并入 theme.js） | `prefers-reduced-motion` 统一降级开关 |

### 7.4 前端落地优先级（建议顺序）

1. **Hero 文字渲染**（首屏价值主张，最高优先）。
2. **PDP 补全**：面包屑/短描述/星级/手风琴/无货禁用/loading/吸底加购条。
3. **集合页筛选**（转化路径最大缺口）。
4. **免运费进度条**（抽屉 + 购物车页）。
5. **焦点管理 + aria 补全**（全局无障碍收口）。
6. **Header 子菜单 + 移动端二级菜单**。
7. **首页重排 + 信任条/类目卡挂载**。
8. **动效降级 `reduced-motion`**。

---

> 本规范与 `01-brand-visual-spec.md` 配套使用：视觉定义「长什么样」，本文定义「怎么用、状态如何、跨端与无障碍怎么达标」。前端落地时如数值冲突，以视觉规范 §0 Token 表为准。
