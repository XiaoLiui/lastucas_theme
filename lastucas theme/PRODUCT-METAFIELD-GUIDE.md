# Las Tucas 产品页长内容 · Metafield 配置说明

> 目标：让同一个 Shopify 店铺里的**不同产品展示不同的详情长页**，数据由产品元字段（Metafields）驱动，产品未填写的模块自动隐藏，不产生空白。

---

## 〇、字段总览（速查）

命名空间统一为 **`custom`**，完整引用格式为 `custom.<key>`。

| 字段 key | 类型 | value 结构 | 渲染位置 |
|----------|------|-----------|----------|
| `icon_features` | Metaobject 列表（`icon_feature`） | 条目：`icon`(文件) / `title`(文本) / `text`(文本) | 主产品区下方图标条 |
| `icon_feature` | 同上（单数兜底） | 同上 | 同上 |
| `content_blocks` | Metaobject 列表（`content_block`） | 条目：`image`(文件) / `eyebrow`(文本) / `title`(文本) / `text`(富文本) / `flip`(布尔) | 交替图文 |
| `content_block` | 同上（单数兜底） | 同上 | 同上 |
| `specifications` | JSON | `{"参数名": "参数值", ...}` | Specifications 双栏表 |
| `faq` | Metaobject 列表（`faq_item`） | 条目：`question`(文本) / `answer`(富文本) | FAQ 折叠区 |
| `order_protection` | 布尔值 | `true` / `false` | 直购保障区开关 |
| `usage_scenes` | Metaobject 列表（`usage_scene`） | 条目：`name` / `image` / `description` | 使用场景切换 |

> 说明：`icon_feature` / `content_block` 为单数兜底键名，代码先读复数、找不到再读单数，二选一即可。

---

## 一、整体原理

产品页（`templates/product.json` / `product.alt.json`）由多个 section 依次渲染。其中长内容由两个 section 负责：

| Section 文件 | 数据来源 | 适用场景 |
|--------------|----------|----------|
| `sections/product-metafields.liquid` | **产品元字段**（一产品一数据） | 每个产品各自维护自己的长内容 |
| `sections/product-feature-builder.liquid` | 模板编辑器里的 blocks（跟模板走） | 一套模板共用一套内容 |

本文档重点讲 **metafield 驱动版**（`product-metafields.liquid`），它实现了「同一模板、不同产品各自填内容」的效果。

**关键规则**：所有模块都加了空数据守卫——对应元字段为空时，整个模块连外层 `<section>` 都不输出，页面不会出现空白带。

---

## 二、元字段定义（后台一次性配置）

### 1. Metaobject 定义（设置 → 自定义数据 → Metaobjects）

需要创建 **3 个 Metaobject 定义**。

#### 定义 A：`icon_feature`（特性图标条单项）

| 字段名 | 字段 key | 类型 |
|--------|----------|------|
| 图标 | `icon` | 文件（图片） |
| 标题 | `title` | 单行文本 |
| 描述 | `text` | 多行文本 |

#### 定义 B：`content_block`（交替图文单项）

| 字段名 | 字段 key | 类型 |
|--------|----------|------|
| 图片 | `image` | 文件（图片） |
| 眉标 | `eyebrow` | 单行文本 |
| 标题 | `title` | 单行文本 |
| 正文 | `text` | 富文本 |
| 图文对调 | `flip` | 真假值（布尔） |

#### 定义 C：`faq_item`（FAQ 单项）

| 字段名 | 字段 key | 类型 |
|--------|----------|------|
| 问题 | `question` | 单行文本 |
| 回答 | `answer` | 富文本 |

### 2. 产品元字段（设置 → 自定义数据 → 产品）

| 元字段名称 | 命名空间.键 | 类型 |
|-----------|-------------|------|
| 特性图标条 | `custom.icon_features` | Metaobject 引用 → 列表，指向 `icon_feature` |
| 长内容图文 | `custom.content_blocks` | Metaobject 引用 → 列表，指向 `content_block` |
| FAQ | `custom.faq` | Metaobject 引用 → 列表，指向 `faq_item` |
| 直购保障区开关 | `custom.order_protection` | 真假值（布尔）。true 时显示 LASTUCAS 品牌保障区（sections/order-protection.liquid，内容写死） |

> 规格表 `custom.specifications` 主题原本已有（`main-product.liquid` 在用它），直接复用，无需新建。

---

## 三、数据填写格式

### `custom.faq`（Metaobject 列表）

在后台产品编辑页元字段区域，通过「添加条目」逐条添加 `faq_item`（问题填 `question`，答案填 `answer` 富文本，可加粗/换行/链接）。

### `custom.specifications`（JSON 对象，键值对）

```json
{
  "Material": "Metal + Fabric",
  "Height": "60 in",
  "Power": "AC 110V",
  "Warranty": "2-Year"
}
```

### `custom.icon_features` / `custom.content_blocks`

在后台产品编辑页的元字段区域，通过「添加条目」逐条添加 Metaobject（像填变体一样），字段即上面的定义 A/B。

---

## 四、页面渲染顺序

产品页从上到下依次是：

1. **main-product** — 图/文/变体/加购（固定，不受 metafield 影响）
2. **usage-scenes** — 使用场景切换（读 `custom.usage_scenes`）
3. **product-metafields** — 本模块，按下面顺序渲染：
   - 特性图标条 ← `custom.icon_features`
   - 交替图文（数量不限，按条目顺序，可勾选 flip 对调）← `custom.content_blocks`
   - 规格表 ← `custom.specifications`
   - FAQ 折叠 ← `custom.faq`
4. **features**（Product Feature Builder）— 模板编辑器 blocks（可选）
5. **recommendations** — 推荐产品

---

## 五、Liquid 实现要点（代码层）

### 1. 空数据守卫

```liquid
{%- liquid
  assign icon_features = product.metafields.custom.icon_features.value
  assign content_blocks = product.metafields.custom.content_blocks.value
  assign specs = product.metafields.custom.specifications.value
  assign faqs = product.metafields.custom.faq.value
  assign has_icons = false
  if icon_features != blank and icon_features.size > 0
    assign has_icons = true
  endif
  # ... 其余同理
-%}
{%- if has_icons or has_blocks or has_specs or has_faqs -%}
  <section class="pfb pfb--metafield"> ... </section>
{%- endif -%}
```

### 2. Metaobject 字段取值

Metaobject 条目的字段通过 `.字段key.value` 访问：

```liquid
{%- for feature in icon_features -%}
  {{ feature.icon.value | image_url: width: 120 }}
  {{ feature.title.value | escape }}
  {{ feature.text.value | escape }}
{%- endfor -%}
```

### 3. 富文本渲染

富文本字段（Metaobject 的「富文本」类型）必须把**字段 drop 本身**（不带 `.value`）传给 `| metafield_tag`，否则会报 `metafield_tag can only be used with a metafield drop`：

```liquid
{%- comment %} 正确 ✅ {% endcomment -%}
<div class="pfb__faq-a">{{ item.answer | metafield_tag }}</div>

{%- comment %} 错误 ❌ .value 后拿到的是裸值，metafield_tag 不认 {% endcomment -%}
<div class="pfb__faq-a">{{ item.answer.value | metafield_tag }}</div>
```

> 记忆规则：**富文本/图片等复杂类型渲染时用 `item.answer | metafield_tag`；纯文本用 `item.title.value | escape`。**

---

## 六、命名约束（重要，之前踩过的坑）

- Shopify 的 **section 文件名**和 **schema 里的 `name`** 都不能超过 **25 个字符**。
- 例如 `product-metafield-sections`（26 字符）会报 `Invalid schema: name 太长` 和 `分区类型不能引用现有分区文件`。
- 当前已改用 `product-metafields`（18 字符），注意保持。

---

## 七、待办 / 可扩展

- [ ] 后台创建 3 个 Metaobject 定义（`icon_feature` / `content_block` / `faq_item`）与 3 个产品元字段
- [ ] 给核心 ASIN 对应产品填写长内容数据
- [ ] （可选）用 Admin API 自动创建 metafield 定义，替代手动后台配置
- [ ] （可选）把场景图集也接入 metafield，实现产品级场景切换
