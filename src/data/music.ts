import { withBase } from '@/lib/asset'

/**
 * 浮动播放器使用的个人歌单。
 *
 * 添加音乐的方法：
 * 1. 将音频文件放入 `public/music/`（支持 mp3 / flac / m4a / ogg）
 * 2. 可将封面放入 `public/music/covers/`
 * 3. 在下方添加曲目，资源路径以 `/music/...` 开头
 *
 * 也可以使用允许跨域和外链访问的远程地址。
 */
export interface Track {
  id: string
  title: string
  artist: string
  /** 例如 `/music/xxx.mp3` 或完整的 HTTPS 地址 */
  src: string
  /** 例如 `/music/covers/xxx.jpg` */
  cover?: string
  /** 可选的秒数提示，界面会使用媒体元数据更新实际时长 */
  duration?: number
}

const defaultCover = withBase('/music/covers/default.svg')

function localMusic(filename: string): string {
  return withBase(`/music/${encodeURIComponent(filename)}`)
}

/** 周杰伦歌曲置顶，《爱琴海》作为首曲。 */
export const playlist: Track[] = [
  {
    id: 'ai-qin-hai',
    title: '爱琴海',
    artist: '周杰伦',
    src: localMusic('ai-qin-hai-zhou-jie-lun.mp3'),
    cover: defaultCover,
  },
  {
    id: 'na-tian-xia-yu-le',
    title: '那天下雨了',
    artist: '周杰伦',
    src: localMusic('na-tian-xia-yu-le-zhou-jie-lun.mp3'),
    cover: defaultCover,
  },
  {
    id: 'shui-xi-han',
    title: '谁稀罕',
    artist: '周杰伦',
    src: localMusic('shui-xi-han-zhou-jie-lun.mp3'),
    cover: defaultCover,
  },
  {
    id: 'qi-yue-de-ji-guang',
    title: '七月的极光',
    artist: '周杰伦',
    src: localMusic('qi-yue-de-ji-guang-zhou-jie-lun.mp3'),
    cover: defaultCover,
  },
  {
    id: 'xin-tiao',
    title: '心跳',
    artist: '王力宏',
    src: localMusic('xin-tiao-wang-li-hong.mp3'),
    cover: defaultCover,
  },
  {
    id: 'ai-cuo',
    title: '爱错',
    artist: '王力宏',
    src: localMusic('ai-cuo-wang-li-hong.mp3'),
    cover: defaultCover,
  },
  {
    id: 'duan-qiao-can-xue',
    title: '断桥残雪',
    artist: '许嵩',
    src: localMusic('duan-qiao-can-xue-xu-song.mp3'),
    cover: defaultCover,
  },
  {
    id: 'lian-ai-ing',
    title: '恋爱ing',
    artist: '五月天',
    src: localMusic('lian-ai-ing-wu-yue-tian.flac'),
    cover: defaultCover,
  },
  {
    id: 'huo-zhe-viva',
    title: '活着 Viva',
    artist: '谢霆锋',
    src: localMusic('huo-zhe-viva-xie-ting-feng.mp3'),
    cover: defaultCover,
  },
  {
    id: 'born-to-do',
    title: 'Born to Do',
    artist: 'Steven Cooper',
    src: localMusic('born-to-do-steven-cooper.mp3'),
    cover: defaultCover,
  },
  {
    id: 'love-story',
    title: 'Love Story',
    artist: 'Taylor Swift',
    src: localMusic('love-story-taylor-swift.mp3'),
    cover: defaultCover,
  },
  {
    id: 'luv-you-feat-jake',
    title: 'Luv you (feat. JAKE)',
    artist: 'from. JAKE',
    src: localMusic('luv-you-feat-jake.mp3'),
    cover: defaultCover,
  },
  {
    id: 'wake-live',
    title: 'Wake (Live)',
    artist: 'Hillsong Young & Free',
    src: localMusic('wake-live-hillsong-young-and-free.mp3'),
    cover: defaultCover,
  },
  {
    id: 'sunset-lover',
    title: 'Sunset Lover',
    artist: 'Newitt',
    src: localMusic('sunset-lover.mp3'),
    cover: defaultCover,
  },
  {
    id: 'gymnopedie-no1',
    title: 'Gymnopédie No.1',
    artist: 'Erik Satie',
    src: localMusic('gymnopedie-no1.mp3'),
    cover: defaultCover,
  },
  {
    id: 'kiss-the-rain',
    title: 'Kiss the Rain (Instrumental)',
    artist: 'Yiruma',
    src: localMusic('kiss-the-rain.mp3'),
    cover: defaultCover,
  },
  {
    id: 'introbella',
    title: 'Introbella',
    artist: 'Introbella',
    src: localMusic('introbella.mp3'),
    cover: defaultCover,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    artist: 'A. Cooper',
    src: localMusic('night-owl.mp3'),
    cover: defaultCover,
  },
]

export type PlayMode = 'order' | 'loop' | 'shuffle' | 'single'

export function getPlaylist(): Track[] {
  return playlist.filter((t) => Boolean(t.src))
}
