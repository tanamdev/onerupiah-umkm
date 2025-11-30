// AI Provider types
export type AIProvider = 'gemini' | 'openai'

export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  description: string
  maxTokens: number
  isAvailable: boolean
  pricing?: {
    inputTokens: number
    outputTokens: number
  }
}

export interface AISettings {
  provider: AIProvider
  model: string
  apiKey?: string
  temperature: number
  maxTokens: number
  toneOfVoice: string
  targetAudience: string
  platforms: string[]
  customInstructions?: string
}

export const AI_PROVIDERS: Record<AIProvider, {
  name: string
  description: string
  icon: string
  color: string
  isComingSoon?: boolean
  models: AIModel[]
}> = {
  gemini: {
    name: 'Google Gemini',
    description: 'AI model dari Google untuk berbagai tugas',
    icon: '🤖',
    color: 'blue',
    models: [
      {
        id: 'gemini-3-pro',
        name: 'Gemini 3 Pro',
        provider: 'gemini',
        description: 'Model paling canggih saat ini — multimodal + reasoning lanjutan + "agentic/vibe-coding"',
        maxTokens: 8388608,
        isAvailable: true,
        pricing: {
          inputTokens: 0.001,
          outputTokens: 0.003
        }
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'gemini',
        description: 'Versi "Pro" dengan kemampuan reasoning, multimodal (teks, gambar, audio, video), cocok untuk tugas kompleks',
        maxTokens: 4194304,
        isAvailable: true,
        pricing: {
          inputTokens: 0.0025,
          outputTokens: 0.0075
        }
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'gemini',
        description: 'Versi "Flash": lebih cepat, efisien — cocok kalau butuh response cepat & biaya relatif rendah',
        maxTokens: 2097152,
        isAvailable: true,
        pricing: {
          inputTokens: 0.000075,
          outputTokens: 0.00015
        }
      },
      {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash‑Lite',
        provider: 'gemini',
        description: 'Varian yang dioptimalkan untuk biaya & throughput tinggi — cocok untuk skala besar atau penggunaan ringan',
        maxTokens: 1048576,
        isAvailable: true,
        pricing: {
          inputTokens: 0.000025,
          outputTokens: 0.00005
        }
      }
    ]
  },
  openai: {
    name: 'OpenAI',
    description: 'AI model dari OpenAI dengan GPT series',
    icon: '🧠',
    color: 'green',
    isComingSoon: true,
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        description: 'Model cepat dan efisien untuk berbagai tugas',
        maxTokens: 16384,
        isAvailable: false,
        pricing: {
          inputTokens: 0.0005,
          outputTokens: 0.0015
        }
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        description: 'Model paling canggih dengan kemampuan reasoning terbaik',
        maxTokens: 8192,
        isAvailable: false,
        pricing: {
          inputTokens: 0.03,
          outputTokens: 0.06
        }
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        description: 'Model GPT-4 yang lebih cepat dan hemat',
        maxTokens: 4096,
        isAvailable: false,
        pricing: {
          inputTokens: 0.01,
          outputTokens: 0.03
        }
      }
    ]
  }
}

export const TONE_OF_VOICE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'creative', label: 'Creative' },
  { value: 'technical', label: 'Technical' }
]

export const TARGET_AUDIENCE_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'young-adults', label: 'Young Adults (18-25)' },
  { value: 'adults', label: 'Adults (25-35)' },
  { value: 'parents', label: 'Parents' },
  { value: 'business', label: 'Business Professionals' },
  { value: 'students', label: 'Students' }
]

export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' }
]