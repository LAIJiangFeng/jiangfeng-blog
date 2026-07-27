/** Default cover for posts/projects without a matched image under /public/image */
export const DEFAULT_COVER = '/image/default.png'

export const site = {
  /** Brand: English name + Blog */
  name: 'Jiangfeng Blog',
  title: 'Jiangfeng Blog — 个人博客',
  description: '技术笔记、生活碎片，以及一些安静的思考。',
  url: 'https://example.com',
  /** Site launch date (YYYY-MM-DD) — used for “运行天数” */
  siteCreatedAt: '2026-07-01',
  author: {
    /** 中文名 */
    name: '江枫',
    /** 英文名 */
    englishName: 'Jiangfeng',
    /** Public avatar path under /public; empty → initials placeholder */
    avatar: '/avatar.jpg',
    /** Short bio under the name on the profile card */
    bio: '技术笔记、生活碎片，以及一些安静的思考。',
    email: '',
    url: '',
  },
  social: {
    /** GitHub profile URL */
    github: 'https://github.com/LAIJiangFeng',
    /** CSDN blog URL */
    csdn: 'https://blog.csdn.net/ysfengshu',
    /** Telegram profile / channel URL — e.g. https://t.me/username */
    telegram: '',
    /**
     * WeChat: QR image under /public (e.g. `/wechat-qr.jpg`).
     * Empty → icon hidden. Click opens QR modal in footer.
     */
    wechat: '/wechat-qr.jpg',
    google: '',
  },
  giscus: {
    repo: '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname' as const,
  },
} as const
