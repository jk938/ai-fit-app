import { ImageAsset } from './types';

// Fallback images in case external links fail or strictly for demo purposes
export const PRESET_PERSONS: ImageAsset[] = [
  {
    id: 'p1',
    url: 'https://i.mji.rip/2025/11/19/51362f10bf363524251691516b323f46.png',
    type: 'person',
    label: '模特 A'
  },
  {
    id: 'p2',
    url: 'https://i.mji.rip/2025/11/19/d42af8d2f41175683d1467bc2c857cbo.png', // Corrected likely typo in user request if needed, or kept as fallback
    type: 'person',
    label: '模特 B'
  },
  {
    id: 'p3',
    url: 'https://picsum.photos/id/64/400/600',
    type: 'person',
    label: '随机模特 C'
  }
];

export const PRESET_CLOTHES: ImageAsset[] = [
  {
    id: 'c1',
    url: 'https://picsum.photos/id/325/400/400',
    type: 'clothing',
    label: '休闲卫衣'
  },
  {
    id: 'c2',
    url: 'https://picsum.photos/id/445/400/400',
    type: 'clothing',
    label: '黑色夹克'
  },
  {
    id: 'c3',
    url: 'https://picsum.photos/id/250/400/400',
    type: 'clothing',
    label: '花纹衬衫'
  }
];

export const MODEL_NAME = 'gemini-2.5-flash-image';
