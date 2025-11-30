import { GoogleGenAI, Modality } from '@google/genai';
import type { GenerationConfig, GeneratedImage } from '@/types/image';
import { getAIImageModelForAPI, getAIModelForAPI, getAITemperatureForAPI, getAIMaxTokensForAPI, getAIApiKey } from '@/lib/ai-settings';
import { activityLogger } from './activityLogger';

// Import modularized services
import {
  buildRealisticFoodPrompt,
  buildPosterPrompt,
  buildProductPrompt,
  fileToGenerativePart,
  generateMockImages as generateMockImagesUtil,
  processAIResponse,
  extractAIErrorMessage,
  isPosterMode,
  isFoodMode,
  isProductMode,
} from './image';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Build prompt based on generation mode
const buildPrompt = (config: GenerationConfig): string => {
  // Debug logging
  console.log('🔍 Mode Detection Debug:', {
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
    isProductMode: isProductMode(config)
  });

  if (isPosterMode(config)) {
    console.log('🎨 Using Poster Mode');
    return buildPosterPrompt(config);
  } else if (isFoodMode(config)) {
    console.log('📸 Using Realistic Food Mode');
    return buildRealisticFoodPrompt(config);
  } else if (isProductMode(config)) {
    console.log('📦 Using Product Mode');
    return buildProductPrompt(config);
  } else {
    // Default fallback to realistic food
    console.log('🔄 Using Default Realistic Food Mode');
    return buildRealisticFoodPrompt(config);
  }
};

export const generateProductPhotography = async (
  imageFile: File,
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  const operation = async (): Promise<GeneratedImage[]> => {
    if (!ai) {
      throw new Error(
        'API Gemini tidak tersedia. Silakan setup API key terlebih dahulu.'
      );
    }

    const imagePart = await fileToGenerativePart(imageFile);
    const textPrompt = buildPrompt(config);

    const generateSingleImage = async (): Promise<string> => {
      // Get user's AI settings
      const [userModel, userTemperature] = await Promise.all([
        getAIImageModelForAPI('gemini-3-pro'),
        getAITemperatureForAPI(0.4)
      ]);

      if (!ai) {
        // Fallback to mock if no AI instance
        const mockImages = generateMockImagesUtil(config, isPoster, 1);
        return mockImages[0].imageUrl;
      }

      const response = await ai.models.generateContent({
        model: userModel,
        contents: {
          parts: [imagePart, { text: textPrompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          temperature: userTemperature,
        },
      });

      try {
        return processAIResponse(response);
      } catch (processError) {
        const textResponse = response.text?.trim();
        console.warn('API did not return a valid image. Text response:', textResponse);

        throw new Error(extractAIErrorMessage(textResponse));
      }
    };

    // Generate 2 images in parallel
    const imagePromises = [generateSingleImage(), generateSingleImage()];
    const imageUrls = await Promise.all(imagePromises);

    return imageUrls.map((url) => ({
      imageUrl: url,
      prompt: textPrompt,
      timestamp: new Date(),
    }));
  };

  // Determine image mode for logging
  const imageMode = isPoster ? 'poster' : (isFoodMode(config) ? 'realistic' : 'product');
  const enhancedConfig = {
    ...config,
    imageMode,
  };

  try {
    const result = await activityLogger.withPerformanceTracking('image', operation, enhancedConfig);

    // Log successful generation
    await activityLogger.logImageGeneration(
      imageMode,
      config,
      true,
      undefined,
      undefined,
      result.length
    );

    return result;
  } catch (error) {
    console.error('Error generating images:', error);

    // Log failed generation
    await activityLogger.logImageGeneration(
      imageMode,
      config,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );

    throw error;
  }
};

// Fallback function untuk demo tanpa API
export const generateMockImages = async (
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const prompt = buildPrompt(config);
  const mockImagesResult = generateMockImagesUtil(config, isPoster, 2);

  return mockImagesResult.map((mock, index) => ({
    imageUrl: mock.imageUrl,
    prompt: prompt,
    timestamp: new Date(),
    imageSize: config.imageSize,
  }));
};

// Fungsi untuk memperbaiki instruksi tambahan menggunakan Gemini API
export const enhanceInstructions = async (
  currentInstructions: string,
  foodName?: string,
  platingStyle?: string,
  imageSize?: any
): Promise<string> => {
  if (!ai) {
    // Fallback ke enhancement tanpa API - hanya untuk instruksi tambahan
    const baseInstructions = currentInstructions.trim();
    const professionalTips = `
💡 **Tips Profesional:**
- Fokus pada detail tekstur dan warna
- Gunakan pencahayaan yang dramatis
- Highlight elemen utama produk
- Pertahankan estetika yang konsisten`;

    const contextInfo = [
      foodName ? `📝 Konteks: ${foodName}` : '',
      platingStyle ? `🎨 Style: ${platingStyle}` : '',
      imageSize ? `📐 Format: ${imageSize.name} (${imageSize.dimensions})` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const enhancedInstructions = contextInfo
      ? `${baseInstructions}\n\n${professionalTips}\n\n${contextInfo}`
      : `${baseInstructions}\n\n${professionalTips}`;

    return enhancedInstructions.trim();
  }

  try {
    // Get user's AI settings for text processing
    const [userModel, userTemperature] = await Promise.all([
      getAIModelForAPI('gemini-3-pro'),
      getAITemperatureForAPI(0.3)
    ]);

    const enhancePrompt = `Tingkatkan instruksi fotografi tambahan berikut menjadi lebih spesifik dan profesional:

Instruksi User:
"${currentInstructions}"

${foodName ? `📸 Target Produk: ${foodName}` : ''}
${platingStyle ? `🎨 Gaya: ${platingStyle}` : ''}
${
  imageSize
    ? `📐 Format Output: ${imageSize.name} (${imageSize.dimensions})`
    : ''
}

Tugas:
- Jangan ubah instruksi utama template (sistem sudah handle bagian utama)
- Fokus hanya memperbaiki & menambah detail pada instruksi tambahan user
- Tambahkan teknik fotografi spesifik jika relevan
- Berikan tips visual yang actionable
- Pertahankan intent user asli
- Max 2-3 kalimat tambahan

Contoh output format:
"${currentInstructions}" + [tambahan profesional singkat]

Hasilkan instruksi tambahan yang lebih baik dan detail.`;

    const response = await ai.models.generateContent({
      model: userModel,
      contents: enhancePrompt,
      config: {
        responseModalities: [Modality.TEXT],
        temperature: userTemperature,
      },
    });

    const enhanced = response.text?.trim();
    return enhanced || currentInstructions;
  } catch (error) {
    console.warn('Failed to enhance instructions:', error);
    return currentInstructions; // Fallback ke original
  }
};

// Main function dengan fallback ke mock
export const generateImage = async (
  imageFile: File | null,
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  try {
    if (!imageFile || !ai) {
      // Fallback ke mock generation jika tidak ada file atau API key
      console.log('Using mock generation (no file or API key)');
      return await generateMockImages(config, isPoster);
    }

    const images = await generateProductPhotography(
      imageFile,
      config,
      isPoster
    );

    // Add image size info to generated images
    return images.map((image) => ({
      ...image,
      imageSize: config.imageSize,
    }));
  } catch (error) {
    console.warn(
      'Failed to generate with Gemini API, falling back to mock:',
      error
    );
    return await generateMockImages(config, isPoster);
  }
};
