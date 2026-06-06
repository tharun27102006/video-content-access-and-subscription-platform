import type { VideoItem } from './types';

export const videos: VideoItem[] = [
  {
    id: 'aurora-run',
    title: 'Aurora Run',
    duration: '02:18',
    quality: '4K sample',
    gradient: 'linear-gradient(135deg, rgba(245,198,215,0.9) 0%, rgba(204,185,255,0.95) 48%, rgba(185,215,255,0.92) 100%)',
    fileName: 'aurora-run.mp4',
    source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  },
  {
    id: 'mint-harbor',
    title: 'Mint Harbor',
    duration: '01:42',
    quality: '1080p sample',
    gradient: 'linear-gradient(135deg, rgba(185,215,255,0.88) 0%, rgba(199,240,223,0.95) 100%)',
    fileName: 'mint-harbor.mp4',
    source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  },
  {
    id: 'sunset-grid',
    title: 'Sunset Grid',
    duration: '03:06',
    quality: 'Cinematic loop',
    gradient: 'linear-gradient(135deg, rgba(204,185,255,0.92) 0%, rgba(241,107,168,0.75) 100%)',
    fileName: 'sunset-grid.mp4',
    source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  }
];
