import type { GenerationConfig, GeneratedImage } from '@/types/image'
import { activityLogger } from './activityLogger'

import {
  buildRealisticFoodPrompt,
  buildPosterPrompt,
  buildProductPrompt,
  generateMockImages as generateMockImagesUtil,
  isPosterMode,
  isFoodMode,
  isProductMode,
} from './image'

const IMAGE_API_ENDPOINT = '/api/ai/image'

// Build prompt based on generation mode
const buildPrompt = (config: GenerationConfig): string => {
  console.log('dY"? Mode Detection Debug:', {
    hasPosterStyle: !!config.posterStyle,
    hasLayoutTemplate: !!config.layoutTemplate,
    hasColorScheme: !!config.colorScheme,
    hasTypographyStyle: !!config.typographyStyle,
    hasFoodName: !!config.foodName,
    hasPlatingStyle: !!config.platingStyle,
    hasProductStyle: !!config.productStyle,
    hasProductType: !!config.productType,
    isPosterMode: isPosterMode(config),
    isFoodMode: isFoodMode(config),
    isProductMode: isProductMode(config),
  })

  if (isPosterMode(config)) {
    console.log('dYZ" Using Poster Mode')
    return buildPosterPrompt(config)
  } else if (isFoodMode(config)) {
    console.log('dY", Using Realistic Food Mode')
    return buildRealisticFoodPrompt(config)
  } else if (isProductMode(config)) {
    console.log('dY"� Using Product Mode')
    return buildProductPrompt(config)
  }

  console.log('dY", Using Default Realistic Food Mode')
  return buildRealisticFoodPrompt(config)
}

const buildFallbackInstructions = (
  currentInstructions: string,
  foodName?: string,
  platingStyle?: string,
  imageSize?: any
): string => {
  const baseInstructions = currentInstructions.trim()
  const professionalTips = `
dY'� **Tips Profesional:**
- Fokus pada detail tekstur dan warna
- Gunakan pencahayaan yang dramatis
- Highlight elemen utama produk
- Pertahankan estetika yang konsisten`

  const contextInfo = [
    foodName ? `dY"? Konteks: ${foodName}` : '',
    platingStyle ? `dYZ" Style: ${platingStyle}` : '',
    imageSize ? `dY"? Format: ${imageSize.name} (${imageSize.dimensions})` : '',
  ]
    .filter(Boolean)
    .join(' �?� ')

  const enhancedInstructions = contextInfo
    ? `${baseInstructions}\n\n${professionalTips}\n\n${contextInfo}`
    : `${baseInstructions}\n\n${professionalTips}`

  return enhancedInstructions.trim()
}

const postImageApi = async (formData: FormData) => {
  const response = await fetch(IMAGE_API_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      errorBody?.message || errorBody?.error || 'Permintaan AI gagal diproses'
    throw new Error(message)
  }

  return response.json()
}

// Fallback function untuk demo tanpa API
export const generateMockImages = async (
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const prompt = buildPrompt(config)
  const mockImagesResult = generateMockImagesUtil(config, isPoster, 2)

  return mockImagesResult.map((mock) => ({
    imageUrl: mock.imageUrl,
    prompt,
    timestamp: new Date(),
    imageSize: config.imageSize,
  }))
}

// Fungsi untuk memperbaiki instruksi tambahan menggunakan Gemini API
export const enhanceInstructions = async (
  currentInstructions: string,
  foodName?: string,
  platingStyle?: string,
  imageSize?: any
): Promise<string> => {
  if (!currentInstructions?.trim()) {
    return currentInstructions
  }

  const formData = new FormData()
  formData.append('action', 'enhance')
  formData.append('instructions', currentInstructions)
  if (foodName) formData.append('foodName', foodName)
  if (platingStyle) formData.append('platingStyle', platingStyle)
  if (imageSize) formData.append('imageSize', JSON.stringify(imageSize))

  try {
    const data = await postImageApi(formData)
    return data.enhancedInstructions || currentInstructions
  } catch (error) {
    console.warn('Failed to enhance instructions via API:', error)
    return buildFallbackInstructions(
      currentInstructions,
      foodName,
      platingStyle,
      imageSize
    )
  }
}

// Main function dengan fallback ke mock
export const generateImage = async (
  imageFile: File | null,
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  if (!imageFile) {
    console.log('Using mock generation (no uploaded file)')
    return generateMockImages(config, isPoster)
  }

  const imageMode = isPoster
    ? 'poster'
    : isFoodMode(config)
    ? 'realistic'
    : 'product'

  const enhancedConfig = {
    ...config,
    imageMode,
  }

  const operation = async (): Promise<GeneratedImage[]> => {
    const formData = new FormData()
    formData.append('action', 'generate')
    formData.append('config', JSON.stringify(config))
    formData.append('isPoster', String(isPoster))
    formData.append('imageSize', JSON.stringify(config.imageSize || null))
    formData.append('image', imageFile)

    const data = await postImageApi(formData)
    return (data.images || []).map((image: any) => ({
      imageUrl: image.imageUrl,
      prompt: image.prompt,
      timestamp: image.timestamp ? new Date(image.timestamp) : new Date(),
      imageSize: config.imageSize,
    }))
  }

  try {
    const result = await activityLogger.withPerformanceTracking(
      'image',
      operation,
      enhancedConfig
    )

    await activityLogger.logImageGeneration(
      imageMode,
      config,
      true,
      undefined,
      undefined,
      result.length
    )

    return result
  } catch (error) {
    console.error('Error generating images:', error)

    await activityLogger.logImageGeneration(
      imageMode,
      config,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    )

    return generateMockImages(config, isPoster)
  }
}
