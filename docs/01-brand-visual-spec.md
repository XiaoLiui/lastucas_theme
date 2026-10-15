# LASTUCAS 品牌视觉规范（VI · Phase 1）

> 版本 v2.0 · 状态：可落地执行（交付给 UX 与前端直接引用）
> 适用范围：Shopify DTC 官网（全英文站点 / 美国市场）
> 视觉方向：**暗调灯廊 · 香槟金点缀（Dark Gallery, Champagne Accent）**
> 对标气质：Flos / Current Collection / Louis Poulsen —— 深底为主，灯是画面唯一光源，无衬线排版，锐利直角，香槟金极克制点缀。

本规范所有色值、字号、间距、圆角均为**可直接编码的数值**。前端落地时优先使用本文定义的 CSS 变量，替换现有主题中散落的硬编码 hex 值。

---

## 0. 一页速查（Token 总表 · v2.0 暗调）

```css
:root {
  /* ---- 表面 / 背景（暗调） ---- */
  --color-bg:            #1C1712;  /* 主背景：深墨（取代暖白 #FAF7F2） */
  --color-bg-alt:        #292219;  /* 次级深底 / 输入框底 */
  --color-surface:       #262019;  /* 卡片面：比主背景略浅一档深底（不用纯白卡片） */
  --color-surface-hover: #2E2A24;  /* 卡片/行 hover */

  /* ---- 文字（深底反色） ---- */
  --color-text:          #F3EEE5;  /* 主文字：暖白（取代暖炭黑 #201B15） */
  --color-text-secondary:#B7AC9D;  /* 次级文字：暖灰（深底 ≥4.5:1） */
  --color-text-muted:    #8E8478;  /* 弱文字：仅装饰 / 禁用 / 大字号 */
  --color-text-inverse:  #1C1712;  /* 反色：金色按钮上的深字 */

  /* ---- 强调：香槟金（克制，只小面积用） ---- */
  --color-accent:        #C7A05C;  /* 主强调：香槟金 */
  --color-accent-strong: #B08A4E;  /* hover / 按压（更深的金） */
  --color-accent-soft:   rgba(199,160,92,0.14);  /* 淡金底（徽章底） */
  --color-accent-bright: #E0BE85;  /* 亮金：焦点环 / 星级高光（深底更可辨识） */

  /* ---- 暖木（仅作材质色，不作界面强调） ---- */
  --color-wood:          #8A674A;  /* 胡桃木材质色（产品色板圆点） */
  --color-wood-deep:     #57412E;  /* 深木 */

  /* ---- 边框 / 分隔 ---- */
  --color-border:        #3A3228;  /* 深底分隔线 / 装饰 hairline */
  --color-border-strong: #4A4033;  /* 输入框静默边框 / 卡片 hover 边框 */

  /* ---- 深色层级 ---- */
  --color-ink:           #0F0C09;  /* 最深层：弹层遮罩 / 抽屉 scrim / 阴影 */
  --color-ink-soft:      #292219;  /* 与 bg-alt 同值：深底上的输入/面板 */

  /* ---- 功能色（深底适配版） ---- */
  --color-success:       #5FA37F;  /* 成功 / 有货 */
  --color-error:         #D4735A;  /* 错误 / 表单校验 */
  --color-warning:       #D69A5A;  /* 警告（低库存） */
  --color-info:          #6F97A8;  /* 信息（可选） */
  --color-sale:          #C97B5F;  /* 促销徽章 / 折后价（陶土） */
  --color-soldout:       #2E2A24;  /* 售罄徽章底 */

  /* ---- 焦点环 ---- */
  --color-focus:         #E0BE85;  /* 深底上可辨识（= accent-bright，10.1:1） */

  /* ---- 字体（全无衬线，同族分层） ---- */
  --font-heading: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-body:    "Inter", "Helvetica Neue", Arial, sans-serif;

  /* ---- 圆角（锐利直角 · 奢华建筑感） ---- */
  --radius-xs:   2px;   /* 徽章 / chip */
  --radius-sm:   4px;   /* 按钮 / 输入框 / 缩略图 */
  --radius-md:   8px;   /* 产品卡片 */
  --radius-lg:   12px;  /* 大媒体框 / 特性卡片 */
  --radius-full: 999px; /* 仅圆形元素：色板圆点 / 分页点 / 头像 */

  /* ---- 动效 ---- */
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --t-fast: 150ms;  --t-base: 250ms;  --t-slow: 600ms;
}
```

---

## 1. 品牌定位与基调

**一句话定位**
> LASTUCAS —— 一座「暗调灯廊」：在深色空间里，让每一盏落地灯成为唯一的光源与主角，用香槟金作极克制的点睛。

**设计关键词（5 个）**
1. **dark gallery（暗调灯廊）** — 深底为主，产品如美术馆展品般被光托起。
2. **light-first（光第一）** — 灯是画面唯一亮部，光斑与暖光晕是核心视觉资产。
3. **premium minimal（高级极简）** — 大负空间、锐利直角、无衬线排版、单色点缀。
4. **architectural（建筑感）** — 对标 Flos / Louis Poulsen 的冷静秩序：锐利边缘、精确字距、克制到近乎安静。
5. **champagne restraint（香槟金的克制）** — 金色只用于 CTA、焦点、极小点缀，不铺张。

**情绪板方向（描述）**
- **空间**：深墨灰墙面、微水泥/深木地板、纱帘透入的微弱环境光；一盏灯是唯一亮部。
- **材质**：拉丝黄铜、胡桃木、亚麻、粗陶、混凝土、深色织物。
- **光影**：金色时刻暖光 2700K，硬朗的投影像与柔和光晕并存；背景压暗、亮部收敛。
- **排版气质**：全大写标题、紧字距、锐利直角、大量留白——如瑞士国际主义 × 奢华展厅。

**明确避免**
- ❌ 纯白/暖白大面积基底、纯白卡片（全站改深底）。
- ❌ 高饱和金黄、荧光色、多色渐变、霓虹。
- ❌ 衬线字体（v2.0 全部去衬线）。
- ❌ 大圆角 / 胶囊按钮 / 柔和阴影（改锐利直角 + 硬阴影）。
- ❌ 电商促销感：倒计时、荧光 Sale 贴、多色标签。

---

## 2. 色彩系统（暗调）

### 2.1 色板（含用途 + 对比度）

对比度标注基于 WCAG 2.x；「正文 ≥4.5:1 / 大字号或装饰 ≥3:1」为达标线。

| Token | Hex | 用途 | 深底对比度 |
|---|---|---|---|
| `--color-bg` | `#1C1712` | 主背景（全站深墨） | — |
| `--color-bg-alt` | `#292219` | 次级深底 / 输入框底 | — |
| `--color-surface` | `#262019` | 卡片面（比主背景略浅一档） | — |
| `--color-surface-hover` | `#2E2A24` | 卡片/行 hover | — |
| `--color-text` | `#F3EEE5` | 主文字、标题 | 15.4:1（AAA） |
| `--color-text-secondary` | `#B7AC9D` | 次级文字、导航默认、描述 | 8.0:1（AAA） |
| `--color-text-muted` | `#8E8478` | 弱文字：占位/禁用/图注 | 4.9:1（仅 bg；bg-alt 上 4.3:1，限装饰/大字号） |
| `--color-text-inverse` | `#1C1712` | 金色按钮上的深字 | 7.3:1（金底上） |
| `--color-accent` | `#C7A05C` | 主强调：香槟金（CTA/链接/焦点/选中） | 7.3:1 |
| `--color-accent-strong` | `#B08A4E` | 金色 hover/按压 | 5.6:1 |
| `--color-accent-soft` | `rgba(199,160,92,0.14)` | 淡金底（New/Best Seller 徽章底） | 装饰性，非文字承载 |
| `--color-accent-bright` | `#E0BE85` | 焦点环 / 星级高光 | 10.1:1 |
| `--color-wood` | `#8A674A` | 胡桃木材质色（仅色板圆点，非文字） | 3.5:1（**不可作文字**） |
| `--color-wood-deep` | `#57412E` | 深木（材质/插画底） | 非文字 |
| `--color-border` | `#3A3228` | 分隔线 / 装饰 hairline | 1.4:1（装饰，非组件边界） |
| `--color-border-strong` | `#4A4033` | 输入框静默边框 / 卡片 hover 边框 | 1.8:1（需配合焦点态） |
| `--color-ink` | `#0F0C09` | 弹层遮罩 / 抽屉 scrim（比 bg 更深） | — |
| `--color-success` | `#5FA37F` | 成功 / 有货 | 6.0:1 |
| `--color-error` | `#D4735A` | 错误 / 表单校验 | 5.4:1 |
| `--color-warning` | `#D69A5A` | 警告（低库存） | 7.3:1 |
| `--color-info` | `#6F97A8` | 信息（可选） | 5.6:1 |
| `--color-sale` | `#C97B5F` | 促销徽章 / 折后价 | 5.5:1 |
| `--color-soldout` | `#2E2A24` | 售罄徽章底 | 见 §7.2 |

### 2.2 与现有主题的映射关系

现有主题变量（`layout/theme.liquid` + `config/settings_schema.json`）需替换为：

| 现有变量 | 现默认值 | 替换为（新默认） | 说明 |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#1C1712` | 深墨主背景 |
| `--color-text` | `#1A1A1A` | `#F3EEE5` | 暖白反色文字 |
| `--color-accent` | `#FFD400` | `#C7A05C` | 香槟金 |

**settings_schema.json 同步修改**：`color_background`→`#1C1712`、`color_text`→`#F3EEE5`、`color_accent`→`#C7A05C`；`font_body` 默认 `assistant_n4`→`inter_n4`；**新增** `font_heading`（default `inter_n6`），并注入为 `--font-heading`。

**base.css 散落硬编码替换对照（前端 Phase 3 执行）**：

| 旧值 | 原场景 | 替换为 |
|---|---|---|
| `#FFD400` | sale 徽章、trust-bar 圆点、图标高光 | `var(--color-accent)` `#C7A05C` |
| `#e6b800` | 折后价 | `var(--color-sale)` `#C97B5F` |
| `#8a7a5a` | footer 标题 / features 图标描边（界面强调用途） | `var(--color-accent)` `#C7A05C` |
| `#8a7a5a` | 产品材质色板 | `var(--color-wood)` `#8A674A`（仅材质，非文字） |
| `#000` | 文字 | `var(--color-text)` `#F3EEE5` |
| `#000` | 深按钮 / 深底 | `var(--color-bg-alt)` `#292219` 或 `var(--color-accent)`（按语义） |
| `#fff` | header / 卡片 / 浅底 | `var(--color-bg)` `#1C1712`（页面底）或 `var(--color-surface)` `#262019`（卡片） |
| `#eee` / `#ccc` | 边框 / 分隔 / 售罄底 | `var(--color-border)` `#3A3228` / `var(--color-soldout)` `#2E2A24` |
| `#666` | 次级文字 | `var(--color-text-secondary)` `#B7AC9D` |
| `#999` | 弱文字 / 划线价 | `var(--color-text-muted)` `#8E8478` |

---

## 3. 字体系统（全无衬线）

### 3.1 字体选择（Shopify font_picker 支持）

| 角色 | 字体 | font_picker slug | 选择理由 |
|---|---|---|---|
| 标题 Heading | **Inter**（备选 DM Sans） | `inter_n5` / `inter_n6` / `inter_n7` | 中性 grotesque，气质接近 Neue Haas Grotesk / Flos 的冷静秩序；大字号全大写 + 紧字距即有建筑感 |
| 正文 Body | **Inter**（备选 Work Sans） | `inter_n4` / `inter_n5` / `inter_n6` | 与标题同族，靠字重/大小写/字距分层；x-height 高、小字号清晰、数字优秀 |

- 推荐**同族 Inter 分层**（最干净、最像 Flos 单 grotesque 体系）；若想 display 更暖，可「标题 DM Sans + 正文 Inter」。
- 字重加载：Inter 400/500/600/700（共 4 个 woff2），标题用 500/600，正文 400/500。
- **禁止**：任何衬线字体；正文全大写；混入第三种字体；标题字重超过 700（会显「厚」）。

### 3.2 字号阶梯（desktop，1rem = 16px）

标题使用**全大写 + 紧字距**；正文字距归零。

| Token | 用途 | 字体 | 字号 px/rem | 行高 | 字重 | 大小写 / 字距 |
|---|---|---|---|---|---|---|
| `--fs-display` | Hero 主标题 | Inter | 72 / 4.5rem | 1.0 | 600 | Uppercase，ls 0.04em |
| `--fs-h1` | 页面大标题 | Inter | 48 / 3rem | 1.05 | 600 | Uppercase，ls 0.04em |
| `--fs-h2` | 区块标题 | Inter | 34 / 2.125rem | 1.1 | 600 | Uppercase，ls 0.05em |
| `--fs-h3` | 子区块标题 | Inter | 26 / 1.625rem | 1.2 | 600 | Sentence，ls -0.01em |
| `--fs-h4` | 小标题 | Inter | 20 / 1.25rem | 1.3 | 600 | Sentence，ls 0 |
| `--fs-h5` | 列表标题 | Inter | 17 / 1.0625rem | 1.4 | 600 | Sentence，ls 0 |
| `--fs-eyebrow` | 眉题（标题上方小标签） | Inter | 12 / 0.75rem | 1.4 | 600 | Uppercase，ls 0.14em |
| `--fs-body` | 正文 | Inter | 16 / 1rem | 1.6 | 400 | ls 0 |
| `--fs-body-sm` | 次级正文 | Inter | 14 / 0.875rem | 1.5 | 400 | ls 0 |
| `--fs-caption` | 图注/说明/版权 | Inter | 12 / 0.75rem | 1.4 | 400 | ls 0.02em |
| `--fs-btn` | 按钮 | Inter | 14 / 0.875rem | 1 | 600 | Uppercase，ls 0.08em |
| `--fs-price` | 价格（大） | Inter | 20 / 1.25rem | 1.2 | 600 | tabular-nums |
| `--fs-price-compare` | 划线价 | Inter | 14 / 0.875rem | 1 | 400 | tabular-nums，line-through |

- 价格统一 `font-variant-numeric: tabular-nums`（等宽数字）。
- **移动端（<768px）**：display 44px、h1 34px、h2 28px、h3 24px；body 保持 16px（≥15px）。
- **眉题（eyebrow）规范**：全大写、12px、600、ls 0.14em，颜色 `--color-accent` 或 `--color-text-secondary`；置于每个区块标题上方，形式如 `FLOOR LAMPS` / `SMALL BATCH CRAFT`。

---

## 4. 间距、栅格与圆角系统

### 4.1 间距 Scale（4pt 基准，保留）

| Token | 值 px |
|---|---|
| `--sp-1` | 4 |
| `--sp-2` | 8 |
| `--sp-3` | 12 |
| `--sp-4` | 16 |
| `--sp-5` | 24 |
| `--sp-6` | 32 |
| `--sp-7` | 48 |
| `--sp-8` | 64 |
| `--sp-9` | 96 |

- 基础节奏单元：**24px**。
- 区块纵向留白（section padding）：desktop `96px`、tablet `64px`、mobile `48px`。
- 卡片内边距：product card `16px`；信息卡 `24px`。

### 4.2 容器与栅格（保留）

- 容器最大宽度 `--container-max: 1200px`。
- 12 列栅格，槽宽 desktop `24px` / mobile `16px`。
- 页面水平留白（gutter）：desktop `48px`、tablet `32px`、mobile `24px`。
- 产品列表栅格：4 列（desktop）/ 3 列（1024px）/ 2 列（768px）/ 2 列（mobile 缩槽）。
- Hero 全宽；正文阅读列宽 `720px`。

### 4.3 圆角规范（v2.0 收敛为锐利直角）

**决定：收敛为锐利直角体系，贴合 Flos / Louis Poulsen 的建筑感。**

| 元素 | 圆角 | Token | v1.0 对照 |
|---|---|---|---|
| 按钮 | 4px | `--radius-sm` | 原 999px pill |
| 输入框 | 4px | `--radius-sm` | 原 10px |
| 徽章 / chip | 2px | `--radius-xs` | 原 999px pill |
| 缩略图 | 4px | `--radius-sm` | 原 6px |
| 产品卡片 | 8px | `--radius-md` | 原 14px |
| 大媒体框 / 特性卡 | 12px | `--radius-lg` | 原 20px |
| 色板圆点 / 分页点 / 头像 | 999px | `--radius-full` | 不变（仅圆形元素） |

- 原则：**「面」用近直角（2–12px），「点」才是圆**；按钮不再用胶囊。锐利直角 + 硬阴影传达奢华冷静。

---

## 5. 影像风格（暗调强化版）

### 5.1 产品图

- **深底图**：背景用深灰墨 `#1C1712` / `#292219` 或深木/微水泥质感底；避免纯黑死黑（保留材质层次）。
- **灯是唯一亮部**：灯罩/发光点 2700K 暖光，光晕与光斑是主角；背景压暗 1–2 档，让光「浮」出来。
- **构图**：落地灯以「低机位仰视」或「平视全高」突出高度；产品占画面 60–70%，四周大负空间。
- **比例**：商品卡 3:4（或 4:5）；PDP 主图 1:1 或 3:4；缩略图 1:1。

### 5.2 场景图（Lifestyle）

- **暗调空间**：深墨墙面、深木/微水泥地板、深色织物；一盏 LASTUCAS 灯作为唯一主光源，形成「暖岛」。
- **光影**：金色时刻侧光或单灯暗调；保留柔和光晕 + 清晰投影像；避免顶光平铺、避免冷白光。
- **色调**：暖中调——亮部提暖、暗部压冷并保持油润；避免 HDR 过饱和、避免蓝紫 cast。

### 5.3 Banner / Hero 图

- 全幅，大负空间；产品偏右或居中，左/中留文字安全区（文字区 ≤50% 宽）。
- 深图加 `#0F0C09` 线性渐变遮罩（0 → 40%，从文字侧向产品侧递减）保证文字对比；灯保持最亮。
- 比例：desktop 16:9；mobile 4:5。

### 5.4 统一调色

- 白平衡 +5 暖；高光 -10；阴影 +8；饱和度 -8；绿色向暖黄、蓝色向青灰偏移；暗部提油润、亮部收敛。
- 输出 sRGB，产品图 2000px 宽以内，WebP/AVIF。

---

## 6. Logo 方向（Wordmark 设计说明 · 无衬线）

**字标主方案：全大写无衬线字标**
- 文字：`LASTUCAS`，全大写，Inter 600（或 DM Sans 500）。
- 字距：letter-spacing **0.18em**（大写大留白，建筑感）。
- 气质：中性 grotesque，冷静、隽永，对标 Flos / Louis Poulsen 的克制，不带衬线的「复古手工感」。
- 颜色：常态 `--color-text` `#F3EEE5`（深底暖白）；反白场景用深字 `#1C1712`（金底/浅底）。

**图形符号方向：弧线 + 光点（保留并简化，可直接 SVG 化）**
- 概念：弧形落地灯抽象为一条**单线圆弧**，从左下向右上延展，弧线末端一个**实心圆点**（光）。
- 参数：1 条圆弧 stroke，线宽 2px，圆头端点（stroke-linecap: round），颜色 `--color-accent` `#C7A05C`；末端圆点直径约线宽 3 倍（6px），填充 `--color-accent-bright` `#E0BE85`；底部一条短横线（弧宽 4 倍）暗示灯座，颜色 `--color-text`。
- 备选：香槟金描边圆环 + 中心暖金圆点（「暖光」）。
- 组合锁：图形左、字标右，垂直居中；clear space = 1 字高；最小使用宽度 120px。
- **前端兜底**：图形符号产出前，Header/Footer 用「全大写 + 0.18em 字距的 Inter 600 字标」占位（`header__logo-text` / `footer__logo`）。
- **Favicon**：弧线 + 光点单色图标，深底，32×32。

---

## 7. 组件视觉规范（深底化）

### 7.1 按钮

| 变体 | 背景 | 文字 | 边框 | hover | active | disabled |
|---|---|---|---|---|---|---|
| Primary（香槟金） | `--color-accent` `#C7A05C` | `#1C1712`（7.3:1 ✓） | 无 | `--color-accent-strong` `#B08A4E`（文字仍 5.6:1 ✓） | 同 hover + `filter: brightness(0.92)` | bg `#292219`，text `#8E8478`，border `#3A3228` |
| Secondary（深填充） | `--color-bg-alt` `#292219` | `--color-text` `#F3EEE5` | 1px `#3A3228` | bg `#2E2A24`，border `#4A4033` | 同 hover + brightness | 同 Primary disabled |
| Outline（暖白描边） | 透明 | `--color-text` `#F3EEE5` | 1px `#B7AC9D`（8.0:1 ✓） | border `#C7A05C`，text `#C7A05C` | 同 hover | border `#3A3228`，text `#8E8478` |

- 高度：Large `52px`（Hero）、Default `48px`、Small `40px`；padding Default `0 28px`。
- 圆角：`4px`（锐利直角）；字体 `--fs-btn`（14px / 600 / Uppercase / ls 0.08em）。
- **焦点环**：`outline: 2px solid var(--color-focus)` `#E0BE85`（10.1:1，深底可辨识）；`outline-offset: 2px`。金色按钮自身聚焦时改用暖白 `#F3EEE5` 焦点环（避免金上金）。
- 宽度：PDP 主 CTA 最大 `420px`；全宽仅用于购物车抽屉/结账。

### 7.2 徽章（Badge）

| 徽章 | 样式 | 对比度 |
|---|---|---|
| Sale | bg `--color-sale` `#C97B5F`，text `#1C1712` | 5.5:1 ✓ |
| Sold out | bg `--color-soldout` `#2E2A24`，text `#B7AC9D`，border 1px `#3A3228` | 6.4:1 ✓ |
| New / Best Seller | bg `--color-accent-soft` `rgba(199,160,92,0.14)`，text `#C7A05C`，border 1px `rgba(199,160,92,0.28)` | 7.3:1 ✓ |

- 圆角 `2px`；字号 11px / 600 / Uppercase / ls 0.08em；padding `4px 8px`。
- 位置：产品图左上角，`12px` inset。

### 7.3 输入框 / 表单

- 高度 `48px`；bg `--color-bg-alt` `#292219`；border `1px solid --color-border-strong` `#4A4033`；圆角 `4px`；padding `0 16px`；文字 16px `--color-text`。
- **Focus**：border → `--color-accent` `#C7A05C`（7.3:1）+ 3px 外发光 `rgba(199,160,92,0.28)`。
- Placeholder：`--color-text-muted` `#8E8478`。
- Label：12px / 600 / Uppercase / ls 0.08em，颜色 `--color-text-secondary`。
- Error：border → `--color-error` `#D4735A`（5.4:1）+ 12px 错误文字 `--color-error`。
- Disabled：bg `#262019`，text muted，border `#3A3228`。
- **可访问性说明**：静默边框 `#4A4033` 对主背景约 1.8:1，属「安静字段」外观；主可辨识状态由**焦点态**承担（香槟金 border + 光环，满足 WCAG 2.4.7 焦点可见与 1.4.11 状态对比）。若需静默态也严格达 3:1，可将输入框边框提亮至 `#6E6559`（≈3.1:1）。

### 7.4 产品卡片（Product Card）

- 卡片：bg `--color-surface` `#262019`；圆角 `8px`；border `1px solid --color-border` `#3A3228`；硬阴影 `0 12px 32px rgba(0,0,0,0.35)`。
- 媒体：比例 3:4，object-fit cover，上边圆角 8px；hover 图片 scale `1.04`（`--t-slow`）。
- Hover：border → `--color-border-strong` `#4A4033`；阴影加深 `0 16px 40px rgba(0,0,0,0.45)`。
- 标题：16px / 600 / Inter，单行截断，`--color-text`。
- 色板圆点：16px，1px 边框 `--color-border-strong`；材质色（胡桃金 `#8A674A` / 黑 `#0F0C09` / 香槟金 `#C7A05C`）。
- 价格：`--fs-price` 20px / 600 `--color-text`；折后价 `--color-sale`；划线价 14px 删除线 `--color-text-muted`。
- 快捷加购按钮：默认隐藏，hover 时底部淡入上移 8px（250ms），Primary 样式 Small 40px。

### 7.5 Header

- 结构：announcement bar（bg `--color-ink` `#0F0C09`，text `#B7AC9D` 12px/500/大写 0.1em，高 36px）+ 主导航。
- 主导航：bg `--color-bg` `#1C1712`，高 `72px`（mobile `64px`），border-bottom `1px solid --color-border` `#3A3228`。
- Logo 字标：全大写 Inter 600 + ls 0.18em，颜色 `--color-text`。
- 导航链接：14px/500 `--color-text-secondary` `#B7AC9D`（8.0:1），间距 `32px`；hover → `--color-text` + 2px `--color-accent` 下划线（offset 4px）。
- 图标（search/cart/account）：20px，stroke 1.5，`--color-text`；购物车计数：16px 正方形（4px 圆角），bg `--color-accent`，text `#1C1712`（7.3:1 ✓）。

### 7.6 Hero

- 全宽；desktop 高 ≥ `640px`，mobile ≥ `520px`；深图加 `#0F0C09` 渐变遮罩（0→40%）。
- 内容左对齐，文字安全区 ≤50% 宽；结构自上而下：eyebrow（12px 大写香槟金）→ Display 标题 72px 全大写 → 副标题 18px `--color-text-secondary`（max-width 520px）→ 双按钮（Primary + Outline）。
- 指示器（dots/arrows）：22px 圆点，active `--color-accent`，其余 `--color-border-strong`；深底可辨识。

### 7.7 商品详情页（PDP）布局基调

- Desktop 2 列：左媒体画廊 `55%`，右信息区 `45%`（sticky）；mobile 上下堆叠。
- 画廊：1 张大图（1:1 或 3:4）+ 缩略图列；缩略图 4px 圆角，选中 2px `--color-accent` 描边（深底可辨识）。
- 信息区自上而下：面包屑（12px muted）→ 产品标题（Inter 32–36px，Sentence）→ 价格块（20px + 划线价）→ 短描述（15px secondary）→ 色板（28px 圆点，选中香槟金环 + 2px 间隙）→ 数量步进器 + Primary「Add to Cart」（max 420px）+ Secondary「Buy It Now」→ 信任行（免运费/30 天退换，13px 图标）→ 手风琴（Description / Specs / Shipping）。
- Mobile：底部 sticky 加购条（Primary 全宽），吸底高 64px + 安全区，bg `#1C1712` 上边框 `#3A3228`。

### 7.8 购物车

- 抽屉：右滑入，宽 `400px`（mobile 全宽）；bg `--color-bg` `#1C1712`；scrim `--color-ink` `#0F0C09` @ 70% 不透明（比 bg 更深）。
- 免运费进度条：高 4px，轨道 `--color-border`，已达成 `--color-accent`；文案 12px secondary。
- 行项目：缩略图 96px（1:1，圆角 4px）→ 标题 14px → 价格 14px → 数量步进器 32px → 删除 12px muted。
- 底部：小计 + Primary「Checkout」全宽；下方 12px 说明（运费/退换）。

### 7.9 Footer

- bg `--color-bg` `#1C1712`；顶部 border `1px solid --color-border`；text `--color-text`，次级 `#B7AC9D`。
- 列：品牌简介 + 邮件订阅 / Shop / Support / About。
- 订阅输入框：bg `#292219`，border `#3A3228`，text `#F3EEE5`；提交按钮 Primary 香槟金。
- 链接 14px，hover → `--color-accent-bright` `#E0BE85`；底部 bar：版权 12px muted、支付图标单色 `#B7AC9D`、社交图标 `#F3EEE5` stroke。
- Logo 字标：`--color-text` 或 `--color-accent`。

---

## 8. 动效基调

- **总原则：动效服务于「安静克制」，不抢戏；尊重 `prefers-reduced-motion`。** 基本保留 v1.0，微调如下。

| 场景 | 时长 | 缓动 | v1.0 变化 |
|---|---|---|---|
| 链接/按钮 hover 变色、下划线 | `--t-fast` 150ms | `--ease-out` | 不变 |
| 卡片 hover（边框/阴影/上移/加购按钮淡入） | `--t-base` 250ms | `--ease-out` | 不变 |
| 产品图 zoom（1 → 1.04） | `--t-slow` 600ms | `--ease-in-out` | 由 500ms 放缓（暗调下更缓更高级） |
| 抽屉/弹层滑入 | 320ms | `--ease-in-out` | 由 300ms 微调 |
| 滚动进入（fade-up 20px） | 500ms | `--ease-out` | 不变 |
| 轮播切换 | 400ms | `--ease-in-out` | 不变 |

- 滚动进入：fade + translateY(20px → 0)，stagger `80ms`，首屏不延迟。
- **避免**：回弹/弹簧、长视差、旋转、>600ms 的装饰性动效、暗底上的剧烈亮度闪烁。

---

## 附：落地清单（给前端 Phase 3 直接对照）

1. `settings_schema.json`：三个色值 default（`#1C1712` / `#F3EEE5` / `#C7A05C`）+ `font_body` default `inter_n4` + 新增 `font_heading`（`inter_n6`）。
2. `theme.liquid` `:root` 注入全量 Token（见 §0），并加 `--font-heading` / `--font-body`。
3. `base.css` 顶部加 `:root` 变量与字体变量；`body` 字体替换为 `var(--font-body)`，背景 `var(--color-bg)`。
4. 按 §2.2 对照表替换散落硬编码 hex（`#FFD400` / `#e6b800` / `#8a7a5a` / `#000` / `#fff` / `#eee` / `#ccc` / `#666` / `#999`）。
5. 按钮/徽章/输入框/卡片/Header/Footer 按 §7 数值重写状态样式，圆角统一走 §4.3 直角体系。
6. 焦点环统一 `--color-focus` `#E0BE85`（金色元素上用暖白 `#F3EEE5`），动效统一走 §8 变量，不写死。
