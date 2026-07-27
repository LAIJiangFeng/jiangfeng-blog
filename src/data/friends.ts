import { site } from '@/config/site'

export interface FriendLink {
  name: string
  url: string
  description?: string
  /** Avatar / site icon URL. Empty → derive from domain favicon */
  avatar?: string
  /** Optional short tags shown on the card */
  tags?: string[]
}

/**
 * 友链列表
 * 以下为公开可访问的独立博客 / 技术站点，便于页面不显得空。
 * 正式上线前请换成真实互链对象；申请互换见 Friends 页底部本站信息。
 */
export const friends: FriendLink[] = [
  {
    name: '阮一峰的网络日志',
    url: 'https://www.ruanyifeng.com/blog/',
    description: '科技爱好者周刊，以及各种技术随笔。',
    tags: ['周刊', '技术'],
  },
  {
    name: 'Anthony Fu',
    url: 'https://antfu.me',
    description: 'Vue / Vite / Nuxt 核心成员，开源与工程实践。',
    avatar: 'https://antfu.me/avatar.png',
    tags: ['开源', '前端'],
  },
  {
    name: 'DIYgod',
    url: 'https://diygod.me',
    description: 'RSSHub 作者，写生活、写代码、写开源。',
    tags: ['RSS', '生活'],
  },
  {
    name: '云游君',
    url: 'https://www.yunyoujun.cn',
    description: '希望能成为一个有趣的人。前端与开源。',
    tags: ['前端', '开源'],
  },
  {
    name: '张鑫旭',
    url: 'https://www.zhangxinxu.com',
    description: 'CSS 与前端交互细节的常去之地。',
    tags: ['CSS', '前端'],
  },
  {
    name: 'Sukka',
    url: 'https://blog.skk.moe',
    description: '写代码、写生活，也写一些折腾笔记。',
    tags: ['技术', '随笔'],
  },
  {
    name: "Randy's Blog",
    url: 'https://lutaonan.com',
    description: '产品、技术与生活方式的交叉思考。',
    tags: ['产品', '技术'],
  },
  {
    name: 'Josh Comeau',
    url: 'https://www.joshwcomeau.com',
    description: 'React、CSS 与动画的深度教程。',
    tags: ['React', 'CSS'],
  },
  {
    name: 'Overreacted',
    url: 'https://overreacted.io',
    description: 'Dan Abramov 的个人博客，关于 React 与软件工程。',
    tags: ['React', '工程'],
  },
]

/** 本站友链信息 — 方便访客互换时复制 */
export const friendSiteInfo = {
  name: site.name,
  url: site.url,
  description: site.description,
  avatar: site.author.avatar || '/logo.png',
} as const

export function getFriends(): FriendLink[] {
  return [...friends]
}

/** Prefer explicit avatar; otherwise Google s2 favicon by host */
export function resolveFriendAvatar(friend: FriendLink): string {
  if (friend.avatar) return friend.avatar
  try {
    const host = new URL(friend.url).hostname
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
  } catch {
    return '/logo.svg'
  }
}
