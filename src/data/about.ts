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
}

export const aboutContent: AboutContent = {
  tagline: 'AI 爱好者 · 全栈 AI 开发',
  badges: ['持续更新中', '基于 MDX 写作', 'Open to chat'],
  story: [
    '我是江枫（Jiangfeng），一名 AI 爱好者。这里是一片安静的角落，用来写下技术笔记、生活碎片，以及那些不适合塞进聊天窗口的想法。从 2018 年在大学里写下第一行 HTML，到如今做全栈 AI 开发，博客不追求更新频率，只希望每一篇都经得起自己回头再读。',
  ],
  now: {
    title: '当前在做',
    items: [
      '打磨本博客',
      'AI Coding / Skill 编写',
      'AI 工作流',
      '自研：简历面试、MCP / Skill 管理等',
      '政企数字化相关项目',
    ],
  },
  timeline: [
    {
      year: '2018',
      title: '入门 · 大学计算机',
      description: '正式接触编程：HTML / CSS → C++ → Java → Spring。',
    },
    {
      year: '2021',
      title: '全栈开发工程师',
      description: 'Vue 前端 + Java 后端，兼微信小程序与 App 开发。',
    },
    {
      year: '2025',
      title: '多端与 AI',
      description: 'React / Vue 与既有技术栈，开始 AI 相关开发。',
    },
    {
      year: '2026',
      title: '全栈 AI · 至今',
      description: 'AI 工作流、UI 设计与全栈交付。',
      current: true,
    },
  ],
  skills: [
    { group: '语言', items: ['Java', 'TypeScript', 'JavaScript', 'C++', 'HTML/CSS'] },
    { group: '前端', items: ['Vue', 'React', '小程序', 'App'] },
    { group: '后端', items: ['Spring', 'Java 全栈'] },
    { group: 'AI', items: ['AI 工作流', 'AI Coding', 'MCP', 'Skill', 'Agent'] },
    { group: '设计 / 其他', items: ['UI 设计', 'Git', '工程化'] },
  ],
}

export function getAboutContent(): AboutContent {
  return aboutContent
}
