# 项目长期笔记

## 项目性质
Shopify 独立站主题项目（品牌 SUNMORY / LASTUCAS，落地灯品类）。用户同时经营亚马逊（Las Tucas 品牌）。

## 主题文件位置（重要）
- 真实主题文件：`C:\Users\12822\Desktop\sunmory-minimal\lastucas theme\`（2026-10-14 起，用户把 `sunmory-minimal\sunmory-minimal\` 改名为 `lastucas theme`）
- WorkBuddy 工作目录 `C:\Users\12822\WorkBuddy\sunmory-minimal` 默认为空，用户习惯把文件放桌面。
- 打包上传用 zip：`C:\Users\12822\Desktop\sunmory-minimal\sunmory-minimal-fixed.zip`
- 主题版本号：1.0.0（写于 `layout/theme.liquid` 顶部注释 + `<head>` 的 `<meta name="theme-version" content="1.0.0">`）。

## 主题技术约定
- OS 2.0 主题：JSON 模板（templates/*.json）+ sections + snippets。
- 可编辑性规则：凡要在 Customizer 里改的内容，必须写进 `{% schema %}` 的 settings/blocks，模板用 `{{ section.settings.xxx }}` 读取。
- 多行大标题：`textarea` 类型 + `{{ ... | escape | newline_to_br }}`。
- header/announcement-bar/footer 通过 `layout/theme.liquid` 的 `{% section %}` 全局挂载。

## 已修复（2026-10-13）
见当日日志。核心：immersive-showcase、footer 等 7 个 section 的硬编码内容已改为可在线编辑。

## Shopify CLI / 本地预览（重要）
- CLI：`F:/node_file/npm_global/shopify`（4.9.3，用 managed node 的 npm 安装）。
- **正确店铺域名**：`test-jnm5pzl2.myshopify.com`（开发店，`sunmory-minimal` 主题在此）。正式店是 `70bedu-th.myshopify.com`。
- ⚠️ 不要用 `sunmory.com.myshopify.com`——这是历史错误配置，会报 not authorized。
- 本地预览：`shopify theme dev --store test-jnm5pzl2.myshopify.com`，地址 `http://127.0.0.1:9292`。
