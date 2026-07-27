import { withBase } from '@/lib/asset'

/**
 * Personal playlist for the floating player.
 *
 * How to add your music:
 * 1. Put audio files under `public/music/` (mp3 / flac / m4a / ogg)
 * 2. Optional covers under `public/music/covers/`
 * 3. Add an entry below — use path starting with `/music/...`
 *
 * External URLs also work (must allow CORS / hotlinking).
 */
export interface Track {
  id: string
  title: string
  artist: string
  /** e.g. `/music/xxx.mp3` or full https URL */
  src: string
  /** e.g. `/music/covers/xxx.jpg` */
  cover?: string
  /** Optional duration hint in seconds (UI will update from media metadata) */
  duration?: number
}

/** Quiet focus playlist — matches Jiangfeng Blog tone. */
export const playlist: Track[] = [
  {
    id: 'sunset-lover',
    title: 'Sunset Lover',
    artist: 'Newitt',
    src: withBase('/music/sunset-lover.mp3'),
    cover: withBase('/music/covers/default.svg'),
  },
  {
    id: 'gymnopedie-no1',
    title: 'Gymnopédie No.1',
    artist: 'Erik Satie',
    src: withBase('/music/gymnopedie-no1.mp3'),
    cover: withBase('/music/covers/default.svg'),
  },
  {
    id: 'kiss-the-rain',
    title: 'Kiss the Rain (Instrumental)',
    artist: 'Yiruma',
    src: withBase('/music/kiss-the-rain.mp3'),
    cover: withBase('/music/covers/default.svg'),
  },
  {
    id: 'introbella',
    title: 'Introbella',
    artist: 'Introbella',
    src: withBase('/music/introbella.mp3'),
    cover: withBase('/music/covers/default.svg'),
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    artist: 'A. Cooper',
    src: withBase('/music/night-owl.mp3'),
    cover: withBase('/music/covers/default.svg'),
  },
]

export type PlayMode = 'order' | 'loop' | 'shuffle' | 'single'

export function getPlaylist(): Track[] {
  return playlist.filter((t) => Boolean(t.src))
}
