export interface ContentGenerationConfig {
  contentType: 'caption' | 'blog' | 'email' | 'social';
  product: string;
  targetAudience: string;
  tone: string;
  platforms: string[];
  keywords?: string;
  extraInstructions?: string;
}

export interface GeneratedContent {
  id: string;
  content: string;
  contentType: string;
  title?: string;
  hashtags?: string[];
  platform?: string;
  tone?: string;
  wordCount?: number;
  timestamp: Date;
  config: ContentGenerationConfig;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: string;
  template: string;
  variables: string[];
  example: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  maxCharacters?: number;
  supportedContentTypes: string[];
}

export interface Tone {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}