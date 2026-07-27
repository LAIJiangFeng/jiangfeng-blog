import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function iconClass(props: IconProps) {
  return ['size-4 shrink-0', props.className].filter(Boolean).join(' ')
}

export function IconGitHub(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={iconClass(props)} {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

/** Telegram */
export function IconTelegram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={iconClass(props)} {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export function IconWeChat(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={iconClass(props)} {...props}>
      <path d="M9.5 4C5.91 4 3 6.58 3 9.75c0 1.78.94 3.37 2.41 4.42L4.9 16.4l2.68-1.34c.6.17 1.24.27 1.92.27.2 0 .4-.01.6-.03A4.9 4.9 0 0 1 9.5 14c-3.04 0-5.5-2.24-5.5-5s2.46-5 5.5-5c.7 0 1.36.12 1.97.33A6.4 6.4 0 0 0 9.5 4zm5.75 5.5c-2.9 0-5.25 2.13-5.25 4.75S12.35 19 15.25 19c.55 0 1.08-.07 1.58-.2l2.07 1.03-.45-1.72C19.7 17.3 20.5 16.1 20.5 14.75c0-2.62-2.35-4.75-5.25-4.75zM8.6 7.9a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7zm3.4 0a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7zm1.7 6.1a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4zm3.3 0a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" />
    </svg>
  )
}

/**
 * CSDN blog — monochrome “C” (matches GitHub / WeChat / RSS via currentColor).
 * Letterform from the official favicon; brand orange intentionally omitted.
 */
export function IconCsdn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={iconClass(props)} {...props}>
      <path
        fillRule="evenodd"
        d="M12 3.5c-4.7 0-8.5 3.58-8.5 8.5s3.8 8.5 8.5 8.5c2.05 0 3.92-.68 5.35-1.82l-1.9-2.05A5.55 5.55 0 0 1 12 17.5c-3.04 0-5.5-2.35-5.5-5.5S8.96 6.5 12 6.5c1.22 0 2.33.4 3.2 1.05l1.85-2.1A8.3 8.3 0 0 0 12 3.5z"
      />
    </svg>
  )
}

/**
 * RSS — subscription feed for readers / aggregators.
 * Not a social network: apps (Feedly, Inoreader…) poll this XML for new posts.
 */
export function IconRss(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={iconClass(props)} {...props}>
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 4.98 20 4 19 4 17.82c0-1.2.98-2.18 2.18-2.18zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83C19.56 11.44 12.56 4.44 4 4.44zm0 5.66v2.83A7.07 7.07 0 0 1 11.07 20h2.83A9.9 9.9 0 0 0 4 10.1z" />
    </svg>
  )
}

export type FooterSocialItem = {
  key: string
  label: string
  href: string
  external?: boolean
  /** open as document (rss) */
  reloadDocument?: boolean
  icon: ReactNode
}
