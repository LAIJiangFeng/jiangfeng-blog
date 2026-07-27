# Blog Sidebar + Reading TOC Design Spec

**Date:** 2026-07-21  
**Status:** Draft for user review  
**Stack:** Vite + React + React Router + Tailwind CSS + MDX（既有 Jiangfeng Blob）  
**Approach:** 方案 A — 列表页共用信息侧栏，阅读页独立 TOC

## 1. Goal

当前首页与列表页以文章/项目卡片为主，信息架构偏空：缺少作者身份、分类/标签入口与站点体量感知。目标是引入成熟第三方个人博客常见的 **经典右侧信息侧栏**，并在文章阅读页提供 **大纲目录（TOC）**，在不引入后端的前提下提升「人 + 站 + 读」的完整度。

## 2. Scope

### 2.1 In scope

| 区域 | 能力 |
|------|------|
| 布局 | `BlogLayout`（主栏 + 信息侧栏）；`ReadingLayout`（正文 + TOC） |
| 列表页侧栏 | 个人卡、分类、标签云、站点统计（无公告） |
| 覆盖页面 | `/`、`/posts`、`/tags`、`/tags/:tag`、`/archive`、`/search` |
| 个人卡 | 头像、中英文名、简介；GitHub / Telegram / Google / linux.do / 邮箱（配置有值才显示） |
| 统计 | 文章、分类、标签、总字数、运行天数、最后活动（对齐参考 UI） |
| 阅读 TOC | 文章详情：桌面右侧粘性大纲 + 窄屏悬浮按钮面板；Scroll spy |
| 配置 | 扩展 `site.ts`（avatar、bio、social、siteCreatedAt） |
| 分类跳转 | `/posts?category=` 过滤（与侧栏分类联动） |

### 2.2 Out of scope

- 公告（Notice）模块
- 文章详情页挂载个人卡 / 分类 / 标签 / 统计信息侧栏
- 后端、访问量、真实 PV/UV
- TOC 自动编号、拖拽改宽、服务端预生成 TOC
- 强制为尚无长文详情的项目页上线 TOC（组件预留即可）
- 全局可配置模块拼装引擎（YAGNI）

## 3. Layout

### 3.1 两类布局

| 布局 | 页面 | 结构 |
|------|------|------|
| **BlogLayout** | `/`、`/posts`、`/tags`、`/tags/:tag`、`/archive`、`/search` | 主内容 + 右侧粘性 `Sidebar` |
| **ReadingLayout** | `/posts/:slug`（项目长文详情若存在则复用） | 正文主栏 + 桌面 `Toc`；窄屏悬浮 TOC |

顶栏、页脚、主题、音乐播放器逻辑保持；仅注意 TOC 悬浮按钮与 Music FAB 的避让。

### 3.2 首页结构

```
OrbHero          ← 全宽，不变
MarqueeBar       ← 全宽，不变
BlogLayout
  ├─ main: HomeFeed（最新文章 / 项目 / 既有底部区块可收敛）
  └─ aside: Sidebar
```

侧栏从 feed 内容区开始，不侵入 Orb 主视觉。

### 3.3 桌面栅格（`lg+`）

- 内容容器：约 `max-w-6xl`（与现 Home feed 一致）
- 主栏：`1fr`；侧栏：固定约 **280–300px**
- 间距：约 `1.5–2rem`
- 侧栏：`position: sticky`，`top` 避开 header 高度

### 3.4 窄屏（`< lg`）

- 单栏：主内容在上
- 侧栏各模块 **全部排在主内容下方**（不抢首屏）
- 阅读页不显示右侧 TOC 栏，改用悬浮按钮

## 4. Sidebar modules

固定顺序：

1. **ProfileCard** — 个人卡  
2. **CategoryList** — 分类  
3. **TagCloud** — 标签  
4. **SiteStats** — 站点统计  

### 4.1 ProfileCard

| 元素 | 来源 | 说明 |
|------|------|------|
| 头像 | `site.author.avatar` | 如 `/avatar.jpg`；缺省 initials 占位 |
| 显示名 | `site.author.name` | 中文名 |
| 副名 | `site.author.englishName` | muted 小号 |
| 简介 | `site.author.bio`（可回退 `site.description`） | 1–2 行 |
| 社交 | `site.social.*` + email | 见下表 |
| 关于 | `/about` | 文字链或轻按钮 |

**社交（有有效 URL / email 才渲染）：**

| Key | 展示 |
|-----|------|
| `github` | GitHub |
| `telegram` | Telegram |
| `google` | Google（公开主页；空则隐藏） |
| `linuxDo` | linux.do 社区账号 |
| `email` | `mailto:`（`site.author.email`） |

### 4.2 CategoryList

- 从已发布文章聚合 `category`（`tech | life | thoughts`）
- 展示中文名 + 篇数（与 `CategoryBadge` 映射一致：技术 / 生活 / 随想）
- 点击：`/posts?category=tech` 等
- 本轮为 Posts 列表补齐 query 过滤

### 4.3 TagCloud

- `getAllTags(posts)`，按 count 降序
- 侧栏 **Top 12**，底部链「全部标签 →」`/tags`
- 项：`#tag` + 数量；点击 `/tags/:tag`

### 4.4 SiteStats（参考列表式统计卡）

| 行 | 计算 |
|----|------|
| 文章 | 已发布 posts 数 |
| 分类 | 实际出现过的 category 种类数（count > 0） |
| 标签 | 不重复 tag 数 |
| 总字数 | 已发布文章正文纯文本字符数之和 |
| 运行天数 | `floor((today - siteCreatedAt) / 1 day) + 1`，后缀「天」 |
| 最后活动 | 最近 `date` 或 `updated` 距今 →「N 天前」/「今天」 |

UI：标题「站点统计」+ 左侧 accent 竖条；每行左图标+标签、右对齐数字。

**总字数：** 在 posts 加载管道为每篇计算 `wordCount`（raw 去 frontmatter 后 `length`），侧栏 `sum`。不引入运行时 MDX AST 全量解析。

**不含** 项目数（与参考卡一致）；项目仍在主栏展示。

## 5. Configuration

扩展 `src/config/site.ts`（示意）：

```ts
author: {
  name: '江枫',
  englishName: 'Jiangfeng',
  avatar: '/avatar.jpg',
  bio: '技术笔记、生活碎片，以及一些安静的思考。',
  email: '',
  url: '',
},
social: {
  github: 'https://github.com/...',
  telegram: 'https://t.me/...',
  google: '',
  linuxDo: 'https://linux.do/u/...',
},
siteCreatedAt: '2026-07-01', // 运行天数起点 YYYY-MM-DD
```

空字符串字段不渲染对应入口。真实链接由站点所有者填写。

## 6. Reading TOC

### 6.1 标题采集

- 正文容器内 `h2, h3`（MDX 正文；不含站点壳层标题）
- 无 `id` 则生成唯一 slug/id
- `TocItem`: `{ id, text, level: 2 | 3 }`
- H3 相对 H2 缩进
- 无标题：不渲染 TOC 栏与悬浮按钮

### 6.2 桌面（`lg+`）

- 正文旁右侧约 **220–240px** 粘性「目录」
- 点击平滑滚动至锚点
- Scroll spy 高亮当前项（IntersectionObserver 或等效）
- 长大纲：TOC 自身 `max-height` + 滚动
- 正文保持约 65–75ch 舒适行宽

### 6.3 窄屏

- 右下角悬浮按钮（避开 MusicPlayer FAB）
- 打开底部抽屉/面板列出大纲
- 点选跳转并关闭
- `aria-expanded`、面板焦点管理

### 6.4 与既有组件

- 保留 `ReadingProgress`
- `PostHeader` / `RelatedPosts` / `Giscus` 留在主栏
- TOC 只跟踪 MDX 正文标题
- `prefers-reduced-motion` 时减弱平滑滚动

## 7. Component & file map

```
src/config/site.ts                 # 扩展 author / social / siteCreatedAt
src/lib/stats.ts                   # 聚合统计（可单测）
src/lib/loadPosts.ts / posts 管道  # wordCount
src/components/sidebar/
  Sidebar.tsx
  ProfileCard.tsx
  CategoryList.tsx
  TagCloud.tsx
  SiteStats.tsx
src/components/toc/
  TableOfContents.tsx
  TocFloatingButton.tsx
src/components/layout/
  BlogLayout.tsx
  ReadingLayout.tsx
src/pages/
  Home, Posts, Tags, TagDetail, Archive, Search  → BlogLayout
  PostDetail                                       → ReadingLayout
```

可选：`About` 复用 `site.social`，避免链接双处硬编码。

## 8. Data flow

```
loadPosts() → PostMeta (+ wordCount)
       │
       ├─ BlogLayout / Sidebar
       │    Profile  ← site config
       │    Categories / Tags / Stats ← posts + siteCreatedAt
       │
       └─ ReadingLayout
            headings ← 挂载后扫描 article 内 h2/h3
```

纯静态；无服务端统计 API。

## 9. Visual alignment

- 卡片：`rounded-2xl`、border、elevated 背景，贴合现 dark/light tokens
- 侧栏标题：section-label + 统计卡左侧 accent 条
- 社交：圆角图标按钮，hover accent
- 统计数字：右对齐；「N 天前」muted
- TOC 当前项：accent + 左侧指示
- 全部走 CSS 变量，兼容主题切换

## 10. Implementation phases

| Phase | Content |
|-------|---------|
| P1 | site 配置 + BlogLayout + Profile / Category / Tag / Stats 壳与数据绑定 |
| P2 | wordCount + stats 聚合与 SiteStats 六项展示 |
| P3 | PostDetail ReadingLayout + 桌面 TOC + 移动悬浮 TOC |
| P4 | `?category=`、FAB 避让、视觉打磨、回归 |

## 11. Acceptance criteria

1. `lg+` 在列表覆盖页可见右侧粘性侧栏，顺序：个人卡 → 分类 → 标签 → 统计  
2. 个人卡字段与社交按配置显示；空配置项不出现  
3. 分类、标签可点击到达正确列表；标签 Top N +「全部」  
4. 站点统计六项语义与参考图一致，随 posts 变化正确  
5. 有 H2/H3 的文章：桌面 TOC + spy；窄屏悬浮 → 面板跳转  
6. 无标题文章不出现 TOC UI  
7. 移动端列表为单栏，侧栏在主内容下可读  
8. 明暗主题可读；无横向滚动回归  
9. 文章列表、项目区、搜索、归档、进度条、评论等既有行为不回归  

## 12. Decisions log

| 决策 | 选择 |
|------|------|
| 布局形态 | 经典右侧信息侧栏 |
| 侧栏页面 | 首页 + 列表类（非详情） |
| 个人卡 | 全量社交，含 linux.do |
| 公告 | 不做 |
| 「目录」含义 | 文章阅读 TOC，非归档目录 |
| TOC 展示 | 桌面右侧 + 移动悬浮按钮 |
| 统计样式 | 列表式六项（参考截图） |
| 实现路径 | 方案 A（共用 Sidebar + 独立 Toc） |
