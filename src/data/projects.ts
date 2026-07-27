import { DEFAULT_COVER } from '@/config/site'

export type ProjectStatus = 'active' | 'shipped' | 'wip' | 'completed'

export interface Project {
  slug: string
  title: string
  summary: string
  year: string
  status: ProjectStatus
  tags: string[]
  /** External or internal URL */
  href: string
  /** true = open in new tab */
  external?: boolean
  /** Optional cover under /public; omit → DEFAULT_COVER */
  cover?: string
}

export const projects: Project[] = [
  {
    slug: 'tauri-dustdesk',
    title: 'DustDesk / DeskNest',
    summary:
      '基于 Tauri 2 + React 的 Windows 桌面效率工具：桌面收纳、快捷启动、剪贴板历史、全局搜索与系统托盘常驻。',
    year: '2026',
    status: 'shipped',
    tags: ['Tauri', 'Rust', 'React', 'Vite'],
    href: 'https://github.com/LAIJiangFeng/tauri-dustdesk',
    external: true,
    cover: '/image/tauri-dustdesk.png',
  },
  {
    slug: 'resume-builder',
    title: 'Resume Builder',
    summary:
      '求职一体化简历平台：模块化编辑、9 套模板、PDF/Markdown 导出，以及 AI 简历优化、模拟面试与知识库 RAG。',
    year: '2026',
    status: 'shipped',
    tags: ['Vue 3', 'Spring AI', 'FastAPI', 'RAG'],
    href: 'https://github.com/LAIJiangFeng/resume-builder',
    external: true,
    cover: '/image/resume-builder.png',
  },
  {
    slug: 'agent-forge',
    title: 'Agent Forge',
    summary:
      'Claude Code Skills 与 MCP 可视化管理桌面工具：集中扫描、在线编辑、健康检查、技能市场一键安装。',
    year: '2026',
    status: 'shipped',
    tags: ['Vue', 'Claude Code', 'MCP', 'Skills'],
    href: 'https://github.com/LAIJiangFeng/Agent-Forge',
    external: true,
    cover: '/image/agent-forge.png',
  },
  {
    slug: 'movie-ticket',
    title: '电影院购票系统',
    summary:
      '基于若依的电影票务平台：Web 管理端 + 微信小程序，覆盖选座购票、排期、订单、评论与运营数据。',
    year: '2024',
    status: 'completed',
    tags: ['Spring Boot', 'Vue 2', 'MyBatis', '小程序'],
    href: 'https://github.com/LAIJiangFeng/movieTicket',
    external: true,
    cover: '/image/movie-ticket.png',
  },
]

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => (a.year < b.year ? 1 : a.year > b.year ? -1 : 0))
}

export function filterProjectsByStatus(
  list: Project[],
  status: ProjectStatus | null,
): Project[] {
  if (!status) return list
  return list.filter((p) => p.status === status)
}

export const statusLabel: Record<ProjectStatus, string> = {
  active: '进行中',
  shipped: '已发布',
  wip: '实验中',
  completed: '已完结',
}
