import { ImageAsset } from './types';

// Fallback images in case external links fail or strictly for demo purposes
// Using unsplash source which is generally CORS friendly for demos
export const PRESET_PERSONS: ImageAsset[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80',
    type: 'person',
    label: '模特 A'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    type: 'person',
    label: '模特 B'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    type: 'person',
    label: '模特 C'
  }
];

export const PRESET_CLOTHES: ImageAsset[] = [
  {
    id: 'c1',
    url: 'https://images.unsplash.com/photo-1551028919-ac76cd465682?w=600&q=80',
    type: 'clothing',
    label: '休闲卫衣'
  },
  {
    id: 'c2',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    type: 'clothing',
    label: '黑色夹克'
  },
  {
    id: 'c3',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    type: 'clothing',
    label: '花纹衬衫'
  }
];

export const MODEL_NAME = 'gemini-2.5-flash-image';