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
  const wantPlayRef = useRef(false)
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

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = 0.7
    audioRef.current = audio

    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => {
      wantPlayRef.current = true
      setPlaying(true)
    }
    const onPause = () => {
      setPlaying(false)
    }
    const onEnded = () => {
      const m = modeRef.current
      const list = tracksRef.current
      const i = indexRef.current
      if (!list.length) return

      if (m === 'single') {
        audio.currentTime = 0
        wantPlayRef.current = true
        void audio.play().catch(() => {
          wantPlayRef.current = false
          setPlaying(false)
        })
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
      wantPlayRef.current = false
      setPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', () => {
      wantPlayRef.current = false
      setPlaying(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    const track = tracks[index]
    if (!audio || !track) return

    const shouldPlay = wantPlayRef.current
    audio.src = track.src
    audio.load()
    setCurrentTime(0)
    setDuration(0)

    if (shouldPlay) {
      void audio.play().catch(() => {
        wantPlayRef.current = false
        setPlaying(false)
      })
    }
  }, [index, tracks])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !tracksRef.current.length) return
    wantPlayRef.current = true
    void audio.play().catch(() => {
      wantPlayRef.current = false
      setPlaying(false)
    })
  }, [])

  const pause = useCallback(() => {
    wantPlayRef.current = false
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) pause()
    else play()
  }, [play, pause])

  const next = useCallback(() => {
    const list = tracksRef.current
    if (!list.length) return
    wantPlayRef.current = true
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
