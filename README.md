# Jiangfeng Blog

江枫的个人博客 — 技术笔记、生活碎片，以及一些安静的思考。

纯前端静态站点：无后端、无登录、无在线编辑器。文章以本地 MDX 编写，构建时编译进产物。

**仓库：** [github.com/LAIJiangFeng/jiangfeng-blog](https://github.com/LAIJiangFeng/jiangfeng-blog)

## 技术栈

| 层级 | 选型 |
|------|------|
| 构建 | [Vite](https://vite.dev/) 8 + TypeScript |
| UI | React 19 + Tailwind CSS 4 |
| 路由 | React Router 7 |
| 内容 | MDX（`@mdx-js/rollup` + frontmatter） |
| 代码高亮 | rehype-pretty-code + Shiki |
| 测试 | Vitest + Testing Library |
| 评论 | Giscus（可配置，默认关闭） |
| SEO | react-helmet-async |

## 功能概览

- **页面：** 首页、文章列表 / 详情、归档、项目、友链、关于、搜索、404
- **内容：** `content/posts/*.mdx`，支持草稿过滤、分类（tech / life / thoughts）、标签
- **阅读：** 目录（TOC）、阅读进度、相关文章、明暗主题
- **发现：** 客户端搜索（标题 / 摘要 / 标签）、分类与标签筛选
- **订阅：** 构建时生成 RSS（`scripts/generate-rss.mjs`）

## 快速开始

### 环境要求

- Node.js 20+（推荐 LTS）
- npm（或兼容的包管理器）

### 安装与开发

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5173`

### 构建与预览

```bash
npm run build    # tsc + vite build + 生成 RSS
npm run preview  # 预览 dist
```

### 测试

```bash
npm test
```

### 仅生成 RSS

```bash
npm run rss
```

## 写文章

1. 在 `content/posts/` 新建 `your-slug.mdx`（文件名即路由 slug）
2. 填写 frontmatter，再写正文（支持 MDX 组件）

```mdx
---
title: 文章标题
date: 2026-07-27
updated: 2026-07-27   # 可选
summary: 列表与 SEO 用的摘要
tags:
  - React
  - Vite
category: tech          # tech | life | thoughts
cover: /image/default.png
draft: false            # true 时生产环境不展示
---

正文从这里开始……
```

封面图放在 `public/` 下，frontmatter 里写以 `/` 开头的公共路径。

## 站点配置

主配置：`src/config/site.ts`

| 配置项 | 说明 |
|--------|------|
| `site.name` / `title` / `description` | 站点品牌与 SEO |
| `site.url` | 正式域名（RSS / OG 会用到；当前为占位） |
| `site.author` | 作者信息与头像 |
| `site.social` | GitHub、CSDN、微信二维码等 |
| `site.giscus` | 评论仓库与 category（留空则不启用） |

其它数据文件：

- `src/data/projects.ts` — 项目页
- `src/data/friends.ts` — 友链
- `src/data/about.ts` — 关于页时间线 / 技能
- `src/data/music.ts` — 页脚音乐播放器曲目

RSS 脚本内的站点信息需与 `site.ts` 保持同步（见 `scripts/generate-rss.mjs` 顶部注释）。

## 目录结构

```
├── content/posts/          # MDX 文章
├── docs/superpowers/       # 设计稿与实现计划
├── public/                 # 静态资源（封面、头像、favicon…）
├── scripts/                # 构建辅助（RSS 等）
└── src/
    ├── components/         # UI、布局、MDX、侧栏、TOC…
    ├── config/             # 站点配置
    ├── data/               # 项目 / 友链 / 关于 / 音乐
    ├── hooks/
    ├── lib/                # posts、toc、stats 等纯逻辑
    ├── pages/              # 路由页面
    └── styles/             # 全局样式（Tailwind）
```

## 部署

`npm run build` 后产物在 `dist/`，可部署到任意静态托管：

- Vercel / Netlify / Cloudflare Pages
- GitHub Pages
- 任意 Nginx / OSS 静态站点

部署前请把 `src/config/site.ts`（以及 RSS 脚本）里的 `url` 改成真实域名。

## 设计文档

历史设计与实现计划在 `docs/superpowers/`：

- [个人博客设计](docs/superpowers/specs/2026-07-17-personal-blog-design.md)
- [侧栏与 TOC](docs/superpowers/specs/2026-07-21-blog-sidebar-toc-design.md)
- [关于页改版](docs/superpowers/specs/2026-07-27-about-page-redesign-design.md)

## License

私人项目 · 内容版权归作者所有。代码未单独声明许可证时，默认仅供参考学习。
