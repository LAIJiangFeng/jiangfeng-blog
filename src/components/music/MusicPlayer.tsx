import { useEffect } from 'react'
import type { PlayMode } from '@/data/music'
import { withBase } from '@/lib/asset'
import { useMusicOptional } from './MusicProvider'

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const modeLabel: Record<PlayMode, string> = {
  order: '顺序播放',
  loop: '列表循环',
  shuffle: '随机播放',
  single: '单曲循环',
}

/** Wide transparent glass modal opened from header music icon. */
export function MusicPlayer() {
  const music = useMusicOptional()
  if (!music || !music.current || !music.expanded) return null

  const {
    tracks,
    current,
    index,
    playing,
    currentTime,
    duration,
    volume,
    muted,
    mode,
    setExpanded,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    cycleMode,
    playAt,
  } = music

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-modal" role="dialog" aria-modal="true" aria-label="音乐播放器">
      <button
        type="button"
        className="music-modal__backdrop"
        aria-label="关闭播放器"
        onClick={() => setExpanded(false)}
      />

      <div className={['music-modal__panel', playing ? 'is-playing' : ''].join(' ')}>
        {/* Ambient layers */}
        <div className="music-modal__fx" aria-hidden>
          <span className="music-modal__orb music-modal__orb--a" />
          <span className="music-modal__orb music-modal__orb--b" />
          <span className="music-modal__orb music-modal__orb--c" />
          <span className="music-modal__scan" />
          <span className="music-modal__grid" />
          <span className="music-modal__shine" />
        </div>

        <div className="music-modal__body">
          {/* Left: cover */}
          <div className="music-modal__left">
            <div className={['music-modal__cover-wrap', playing ? 'is-playing' : ''].join(' ')}>
              <span className="music-modal__ring music-modal__ring--outer" />
              <span className="music-modal__ring music-modal__ring--mid" />
              <img
                src={current.cover || withBase('/music/covers/default.svg')}
                alt=""
                className={['music-modal__cover', playing ? 'is-spinning' : ''].join(' ')}
              />
              {playing && (
                <span className="music-modal__wave" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
          </div>

          {/* Center: now playing + controls */}
          <div className="music-modal__center">
            <div className="music-modal__meta-row">
              <div className="min-w-0 flex-1">
                <p className="music-modal__kicker">
                  <span className={playing ? 'music-live' : ''}>
                    {playing ? 'NOW PLAYING' : 'PAUSED'}
                  </span>
                  <span className="music-modal__mode-tag">{modeLabel[mode]}</span>
                </p>
                <h2 className="music-modal__title" title={current.title}>
                  {current.title}
                </h2>
                <p className="music-modal__artist" title={current.artist}>
                  {current.artist}
                </p>
              </div>
              <button
                type="button"
                className="music-icon-btn music-modal__close"
                aria-label="关闭"
                onClick={() => setExpanded(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="music-progress-row">
              <span className="music-time">{formatTime(currentTime)}</span>
              <div className="music-progress-track">
                <input
                  type="range"
                  className="music-progress"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Number.isFinite(currentTime) ? currentTime : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  aria-label="播放进度"
                />
                <div className="music-progress-fill" style={{ width: `${progress}%` }} />
                <div className="music-progress-glow" style={{ left: `${progress}%` }} />
              </div>
              <span className="music-time">{formatTime(duration)}</span>
            </div>

            <div className="music-controls">
              <button
                type="button"
                className="music-icon-btn"
                onClick={cycleMode}
                title={modeLabel[mode]}
                aria-label={`播放模式：${modeLabel[mode]}`}
              >
                <ModeIcon mode={mode} />
              </button>
              <button type="button" className="music-icon-btn" onClick={prev} aria-label="上一首">
                <PrevIcon />
              </button>
              <button
                type="button"
                className="music-play-btn"
                onClick={toggle}
                aria-label={playing ? '暂停' : '播放'}
              >
                <span className="music-play-btn__glow" aria-hidden />
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button type="button" className="music-icon-btn" onClick={next} aria-label="下一首">
                <NextIcon />
              </button>
              <div className="music-volume">
                <button
                  type="button"
                  className="music-icon-btn"
                  onClick={toggleMute}
                  aria-label={muted || volume === 0 ? '取消静音' : '静音'}
                >
                  {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
                </button>
                <input
                  type="range"
                  className="music-volume-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="音量"
                  style={
                    {
                      // Fill track up to current volume so the bar is easy to read
                      '--music-vol': `${(muted ? 0 : volume) * 100}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </div>

          {/* Right: compact playlist */}
          <div className="music-modal__right">
            <div className="music-modal__list-head">
              <span>QUEUE</span>
              <span>{tracks.length}</span>
            </div>
            <ul className="music-list">
              {tracks.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={['music-list__item', i === index ? 'is-active' : ''].join(' ')}
                    onClick={() => playAt(i)}
                  >
                    <span className="music-list__idx">
                      {i === index && playing ? <EqualizerIcon /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="music-list__meta">
                      <span className="music-list__title">{t.title}</span>
                      <span className="music-list__artist">{t.artist}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MusicNavButton({ className = '' }: { className?: string }) {
  const music = useMusicOptional()
  if (!music || !music.tracks.length) return null

  const { playing, expanded, setExpanded } = music

  return (
    <button
      type="button"
      className={[
        'icon-btn music-nav-btn inline-flex h-8 w-8 items-center justify-center rounded-md border sm:h-9 sm:w-9',
        playing ? 'is-playing' : '',
        className ||
          'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]',
      ].join(' ')}
      aria-label={expanded ? '关闭音乐播放器' : '打开音乐播放器'}
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <MusicNoteIcon />
      {playing && <span className="music-nav-btn__dot" aria-hidden />}
    </button>
  )
}

export function MusicEscapeListener() {
  const music = useMusicOptional()
  useEffect(() => {
    if (!music?.expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') music.setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [music])
  return null
}

function MusicNoteIcon() {
  // Filled eighth note — matches the common solid music-note glyph
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  )
}
function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  )
}
function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
    </svg>
  )
}
function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M5 9v6h4l5 4V5L9 9H5zm11.5 3a2.5 2.5 0 0 0-1.5-2.3v4.6a2.5 2.5 0 0 0 1.5-2.3z" />
    </svg>
  )
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M16.5 12c0-.8-.3-1.5-.8-2.1l1.1-1.1A4.5 4.5 0 0 1 18 12a4.5 4.5 0 0 1-.6 2.2l-1.2-1.2c.2-.3.3-.7.3-1zM5 9v6h4l5 4v-5.2l-6.2-6.2L9 9H5zm11.7-4.3L5.3 16.1l1.4 1.4 11.4-11.4-1.4-1.4z" />
    </svg>
  )
}
function EqualizerIcon() {
  return (
    <span className="music-eq" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  )
}
function ModeIcon({ mode }: { mode: PlayMode }) {
  if (mode === 'shuffle') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M10.6 9.2 4 3l1.4-1.4 6.6 6.2L10.6 9.2zM14.5 4h5v2h-3.1l-2.4 2.3-1.4-1.4L14.5 4zM4 21l6.6-6.2 1.4 1.4L6.9 21H10v2H4v-2zM19.5 18H16l-2.5-2.4 1.4-1.4 2.4 2.3h2.2v1.5z" />
      </svg>
    )
  }
  if (mode === 'single') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zM13 15V9h-1l-2 1v1.5h1.2V15H13z" />
      </svg>
    )
  }
  if (mode === 'loop') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M4 6h12v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
    </svg>
  )
}
