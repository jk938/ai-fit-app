export interface ImageAsset {
  id: string;
  url: string;
  type: 'person' | 'clothing' | 'result';
  label?: string;
}

export enum AppStep {
  PersonSelection = 1,
  ClothingSelection = 2,
  Generation = 3
}

export interface HistoryItem {
  id: string;
  personUrl: string;
  clothingUrl: string;
  resultUrl: string;
  timestamp: number;
}

export type LoadingState = 'idle' | 'generating-clothes' | 'generating-tryon' | 'error';
