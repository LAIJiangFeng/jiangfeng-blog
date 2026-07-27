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

/** Demo tracks (free samples). Replace with your own files anytime. */
export const playlist: Track[] = [
  {
    id: 'demo-1',
    title: 'SoundHelix Song 1',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: '/music/covers/default.svg',
  },
  {
    id: 'demo-2',
    title: 'SoundHelix Song 2',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: '/music/covers/default.svg',
  },
  {
    id: 'demo-3',
    title: 'SoundHelix Song 3',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: '/music/covers/default.svg',
  },
]

export type PlayMode = 'order' | 'loop' | 'shuffle' | 'single'

export function getPlaylist(): Track[] {
  return playlist.filter((t) => Boolean(t.src))
}
