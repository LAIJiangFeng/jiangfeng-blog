# Jiangfeng Blog — 项目说明（给 AI / 协作者）

个人静态博客：**Vite + React 19 + React Router 7 + Tailwind 4 + MDX**。

## 关键约束

- **不要**引入后端、CMS、登录或数据库；内容只来自 `content/posts/*.mdx` 与 `src/data/*`。
- 站点品牌与社交链接统一改 `src/config/site.ts`；RSS 脚本 `scripts/generate-rss.mjs` 顶部站点字段需同步。
- 样式以 `src/styles/index.css` 为主（含主题 token）；组件用 Tailwind utility，避免重复造全局 CSS 变量。
- 路径别名：`@` → `src`，`@content` → `content`（见 `vite.config.ts`）。
- 生产环境排除 `draft: true` 的文章；开发环境可显示草稿。

## 常用命令

```bash
npm run dev      # 开发
npm run build    # 类型检查 + 构建 + RSS
npm test         # Vitest
npm run rss      # 仅生成 RSS
```

## 改动时注意

| 改什么 | 动哪里 |
|--------|--------|
| 新文章 | `content/posts/<slug>.mdx` |
| 导航 | `src/components/layout/navLinks.ts` |
| 路由 | `src/App.tsx` |
| 项目 / 友链 / 关于 | `src/data/*.ts` |
| 封面默认图 | `src/config/site.ts` 的 `DEFAULT_COVER` + `public/image/` |

## 文档

设计与计划：`docs/superpowers/specs/`、`docs/superpowers/plans/`。  
用户向说明见根目录 `README.md`。
