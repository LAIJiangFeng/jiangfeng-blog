export type NavIconName =
  | 'home'
  | 'posts'
  | 'projects'
  | 'friends'
  | 'about'
  | 'search'

export interface NavLinkItem {
  to: string
  label: string
  icon: NavIconName
  end?: boolean
}

/** Primary top navigation (search is header icon, not a text link) */
export const navLinks: NavLinkItem[] = [
  { to: '/', label: '首页', icon: 'home', end: true },
  { to: '/posts', label: '文章', icon: 'posts' },
  { to: '/projects', label: '项目', icon: 'projects' },
  { to: '/friends', label: '友链', icon: 'friends' },
  { to: '/about', label: '关于', icon: 'about' },
]
