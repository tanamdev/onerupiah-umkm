export interface ImageSize {
  id: string;
  name: string;
  ratio: string;
  dimensions: string;
  description: string;
  width: number;
  height: number;
  category: string;
}

export interface GenerationConfig {
  platingStyle: string;
  backgroundStyle: string;
  extraInstructions?: string;
  imageSize?: ImageSize;
  foodName?: string;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  timestamp?: Date;
  imageSize?: ImageSize;
}