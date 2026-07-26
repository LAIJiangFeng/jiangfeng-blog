export type AboutTimelineItem = {
  year: string
  title: string
  description: string
  current?: boolean
}

export type AboutSkillGroup = {
  group: string
  items: string[]
}

export type AboutContent = {
  tagline: string
  badges: string[]
  story: string[]
  now: {
    title: string
    items: string[]
  }
  timeline: AboutTimelineItem[]
  skills: AboutSkillGroup[]
  /** Flat skill list for marquee / dense chips */
  skillTags: string[]
}

export const aboutContent: AboutContent = {
  tagline: 'AI 爱好者 · 全栈 AI 开发',
  badges: ['写作中', 'MDX', 'Open to chat'],
  story: [
    '我是江枫，用这片角落记下技术笔记与安静想法。2018 年从 HTML 入门，如今做全栈 AI——慢一点写，认真一点交付。',
  ],
  now: {
    title: '此刻',
    items: ['打磨本博客', 'AI Coding / Skill', 'AI 工作流', '政企数字化'],
  },
  timeline: [
    {
      year: '2018',
      title: '大学入门',
      description: 'HTML / CSS → C++ → Java → Spring',
    },
    {
      year: '2021',
      title: '全栈开发',
      description: 'Vue + Java，小程序与 App',
    },
    {
      year: '2025',
      title: '多端与 AI',
      description: 'React / Vue，开始 AI 相关开发',
    },
    {
      year: '2026',
      title: '全栈 AI',
      description: 'AI 工作流 · UI · 全栈交付',
      current: true,
    },
  ],
  skills: [
    { group: '语言', items: ['Java', 'TypeScript', 'JavaScript'] },
    { group: '前端', items: ['Vue', 'React', '小程序'] },
    { group: '后端', items: ['Spring', 'Node'] },
    { group: 'AI', items: ['工作流', 'MCP', 'Skill', 'Agent'] },
  ],
  skillTags: [
    'Java',
    'TypeScript',
    'Vue',
    'React',
    'Spring',
    '小程序',
    'AI 工作流',
    'MCP',
    'Skill',
    'Agent',
    'UI',
    'Git',
  ],
}

export function getAboutContent(): AboutContent {
  return aboutContent
}
