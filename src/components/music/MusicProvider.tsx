import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getPlaylist, type PlayMode, type Track } from '@/data/music'

interface MusicContextValue {
  tracks: Track[]
  current: Track | null
  index: number
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  mode: PlayMode
  expanded: boolean
  setExpanded: (v: boolean) => void
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  cycleMode: () => void
  playAt: (i: number) => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

const MODE_ORDER: PlayMode[] = ['order', 'loop', 'shuffle', 'single']

function shuffleIndex(len: number, exclude: number): number {
  if (len <= 1) return 0
  let next = exclude
  while (next === exclude) {
    next = Math.floor(Math.random() * len)
  }
  return next
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const tracks = useMemo(() => getPlaylist(), [])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  /** Prefer playing on entry; browsers may block until a user gesture. */
  const wantPlayRef = useRef(true)
  /** True only after the user explicitly pauses — skips gesture auto-resume. */
  const userPausedRef = useRef(false)
  /** Bumps on each play attempt so stale play() rejections cannot clobber UI. */
  const playGenRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [muted, setMuted] = useState(false)
  const [mode, setMode] = useState<PlayMode>('order')
  const [expanded, setExpanded] = useState(false)
  const modeRef = useRef(mode)
  const indexRef = useRef(index)
  const tracksRef = useRef(tracks)

  modeRef.current = mode
  indexRef.current = index
  tracksRef.current = tracks

  const current = tracks[index] ?? null

  /** Start playback; ignore outdated promise rejections from earlier attempts. */
  const tryPlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !tracksRef.current.length) return

    userPausedRef.current = false
    wantPlayRef.current = true
    const gen = ++playGenRef.current

    void audio
      .play()
      .then(() => {
        if (gen !== playGenRef.current) return
        // Source of truth: element is actually playing
        if (!audio.paused) setPlaying(true)
      })
      .catch(() => {
        if (gen !== playGenRef.current) return
        // Only mark paused if this attempt still owns the generation and audio is idle
        if (audio.paused) setPlaying(false)
      })
  }, [])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.volume = 0.7
    audioRef.current = audio

    const onTime = () => {
      setCurrentTime(audio.currentTime || 0)
      // Heal desync: time advances only while actually playing
      if (!audio.paused) setPlaying(true)
    }
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => {
      wantPlayRef.current = true
      userPausedRef.current = false
      setPlaying(true)
    }
    const onPause = () => {
      // load() / src change also fires `pause`. If we still intend to play, do not
      // flip the UI to PAUSED — tryPlay / `playing` will set the real state.
      if (userPausedRef.current || !wantPlayRef.current) {
        setPlaying(false)
        return
      }
      if (!audio.paused) setPlaying(true)
    }
    const onEnded = () => {
      const m = modeRef.current
      const list = tracksRef.current
      const i = indexRef.current
      if (!list.length) return

      if (m === 'single') {
        audio.currentTime = 0
        tryPlay()
        return
      }
      if (m === 'shuffle') {
        wantPlayRef.current = true
        setIndex(shuffleIndex(list.length, i))
        return
      }
      if (m === 'loop' || i < list.length - 1) {
        wantPlayRef.current = true
        setIndex((i + 1) % list.length)
        return
      }
      // End of list in order mode → wrap for continuous background listening
      wantPlayRef.current = true
      setIndex(0)
    }
    const onError = () => {
      wantPlayRef.current = false
      setPlaying(false)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('playing', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('playing', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [tryPlay])

  useEffect(() => {
    const audio = audioRef.current
    const track = tracks[index]
    if (!audio || !track) return

    const shouldPlay = wantPlayRef.current
    // Invalidate in-flight play() from the previous track / attempt
    playGenRef.current += 1
    audio.src = track.src
    audio.load()
    setCurrentTime(0)
    setDuration(0)

    if (shouldPlay) tryPlay()
  }, [index, tracks, tryPlay])

  // If the browser blocks autoplay with sound, start on the first interaction.
  useEffect(() => {
    if (!tracks.length) return

    const unlock = () => {
      if (userPausedRef.current) return
      const audio = audioRef.current
      if (!audio) return
      if (!audio.paused) {
        setPlaying(true)
        return
      }
      tryPlay()
    }

    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    for (const ev of events) {
      document.addEventListener(ev, unlock, { passive: true })
    }
    return () => {
      for (const ev of events) {
        document.removeEventListener(ev, unlock)
      }
    }
  }, [tracks.length, tryPlay])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  const play = useCallback(() => {
    tryPlay()
  }, [tryPlay])

  const pause = useCallback(() => {
    userPausedRef.current = true
    wantPlayRef.current = false
    playGenRef.current += 1
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (audio && !audio.paused) pause()
    else play()
  }, [play, pause])

  const next = useCallback(() => {
    const list = tracksRef.current
    if (!list.length) return
    wantPlayRef.current = true
    userPausedRef.current = false
    const i = indexRef.current
    if (modeRef.current === 'shuffle') setIndex(shuffleIndex(list.length, i))
    else setIndex((i + 1) % list.length)
  }, [])

  const prev = useCallback(() => {
    const audio = audioRef.current
    const list = tracksRef.current
    if (!list.length) return
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    wantPlayRef.current = true
    userPausedRef.current = false
    const i = indexRef.current
    if (modeRef.current === 'shuffle') setIndex(shuffleIndex(list.length, i))
    else setIndex((i - 1 + list.length) % list.length)
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || time))
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((v: number) => {
    const nextVol = Math.max(0, Math.min(1, v))
    setVolumeState(nextVol)
    if (nextVol > 0) setMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((m) => !m)
  }, [])

  const cycleMode = useCallback(() => {
    setMode((m) => MODE_ORDER[(MODE_ORDER.indexOf(m) + 1) % MODE_ORDER.length])
  }, [])

  const playAt = useCallback(
    (i: number) => {
      if (i < 0 || i >= tracksRef.current.length) return
      if (i === indexRef.current) {
        toggle()
        return
      }
      wantPlayRef.current = true
      userPausedRef.current = false
      setIndex(i)
    },
    [toggle],
  )

  const value = useMemo<MusicContextValue>(
    () => ({
      tracks,
      current,
      index,
      playing,
      currentTime,
      duration,
      volume,
      muted,
      mode,
      expanded,
      setExpanded,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      cycleMode,
      playAt,
    }),
    [
      tracks,
      current,
      index,
      playing,
      currentTime,
      duration,
      volume,
      muted,
      mode,
      expanded,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      cycleMode,
      playAt,
    ],
  )

  if (!tracks.length) {
    return <>{children}</>
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}

export function useMusicOptional(): MusicContextValue | null {
  return useContext(MusicContext)
}
