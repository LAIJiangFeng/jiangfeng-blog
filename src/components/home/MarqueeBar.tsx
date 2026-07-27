const ITEMS = [
  'TECH NOTES',
  '技术笔记',
  'BUILD IN PUBLIC',
  '慢慢交付',
  'MDX · REACT',
  '生活碎片',
  'QUIET THOUGHTS',
  '随想',
  'JIANGFENG BLOB',
  '江枫',
] as const

function MarqueeTrack({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul className="marquee-track" aria-hidden={ariaHidden || undefined}>
      {ITEMS.map((label) => (
        <li key={label} className="marquee-item">
          <span className="marquee-text">{label}</span>
          <span className="marquee-dot" aria-hidden />
        </li>
      ))}
    </ul>
  )
}

/** Infinite horizontal ticker between hero and content. */
export function MarqueeBar() {
  return (
    <div className="marquee-bar" role="presentation">
      <div className="marquee-viewport">
        <div className="marquee-row">
          <MarqueeTrack />
          <MarqueeTrack ariaHidden />
        </div>
      </div>
    </div>
  )
}
