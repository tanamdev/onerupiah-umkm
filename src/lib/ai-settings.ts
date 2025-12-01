import type { AISettings } from '@/types/ai'

// Function to get user's AI settings from the server
export const getUserAISettings = async (): Promise<AISettings | null> => {
  try {
    const response = await fetch('/api/auth/me')
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const user = data.user

    if (!user) {
      return null
    }

    return {
      provider: user.aiProvider || 'gemini',
      model: user.aiModel || 'gemini-3-pro',
      temperature: user.aiTemperature || 0.7,
      maxTokens: user.aiMaxTokens || 1000,
      toneOfVoice: user.aiToneOfVoice || 'professional',
      targetAudience: user.aiTargetAudience || 'general',
      platforms: user.aiPlatforms || ['instagram', 'facebook'],
      customInstructions: user.aiCustomInstructions || ''
    }
  } catch (error) {
    console.error('Failed to get user AI settings:', error)
    return null
  }
}

// Function to get AI model for API calls
export const getAIModelForAPI = async (fallbackModel: string = 'gemini-3-pro'): Promise<string> => {
  const settings = await getUserAISettings()
  const modelId = settings?.model || fallbackModel

  // Map model IDs to correct API names
  const modelApiMap: Record<string, string> = {
    'gemini-3-pro': 'gemini-3-pro-preview',
    'gemini-2.5-pro': 'gemini-2.5-pro',
    'gemini-2.5-flash': 'gemini-2.5-flash',
    'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite'
  }

  return modelApiMap[modelId] || modelId
}

// Function to get AI model for image generation API calls
export const getAIImageModelForAPI = async (fallbackModel: string = 'gemini-3-pro'): Promise<string> => {
  const settings = await getUserAISettings()
  const modelId = settings?.model || fallbackModel

  // Map model IDs to correct image generation API names
  const imageModelApiMap: Record<string, string> = {
    'gemini-3-pro': 'gemini-3-pro-image-preview',
    'gemini-2.5-pro': 'gemini-2.5-pro-image-generation',
    'gemini-2.5-flash': 'gemini-2.5-flash-image-generation',
    'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite-image-generation'
  }

  return imageModelApiMap[modelId] || `${modelId}-image-generation`
}

// Function to get AI temperature for API calls
export const getAITemperatureForAPI = async (fallbackTemp: number = 0.7): Promise<number> => {
  const settings = await getUserAISettings()
  return settings?.temperature || fallbackTemp
}

// Function to get AI max tokens for API calls
export const getAIMaxTokensForAPI = async (fallbackTokens: number = 2048): Promise<number> => {
  const settings = await getUserAISettings()
  return settings?.maxTokens || fallbackTokens
}

// Function to get AI API key (for future use when we support custom API keys)
