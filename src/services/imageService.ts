import { GoogleGenAI, Modality } from '@google/genai';
import type { GenerationConfig, GeneratedImage } from '@/types/image';
import {
  SYSTEM_PROMPT_TEMPLATE,
  PRODUCT_PROMPT_TEMPLATE,
  POSTER_PROMPT_TEMPLATE,
} from '@/constants/prompts';
import { getAIImageModelForAPI, getAIModelForAPI, getAITemperatureForAPI, getAIMaxTokensForAPI, getAIApiKey } from '@/lib/ai-settings';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const buildPrompt = (
  config: GenerationConfig,
  isFood: boolean = false,
  isPoster: boolean = false
): string => {
  let template: string;

  if (isPoster) {
    template = POSTER_PROMPT_TEMPLATE;
  } else {
    template = isFood ? SYSTEM_PROMPT_TEMPLATE : PRODUCT_PROMPT_TEMPLATE;
  }

  let prompt = template;

  // Handle food name replacement for all templates
  if (config.foodName) {
    prompt = prompt.replace('{{food_name}}', config.foodName);
  }

  // Handle style replacements
  if (isPoster) {
    // Poster-specific replacements
    prompt = prompt
      .replace('{{poster_style}}', config.posterStyle || 'Modern Minimalist')
      .replace(
        '{{layout_template}}',
        config.layoutTemplate || 'Center Focus - Product sebagai hero di tengah'
      )
      .replace(
        '{{color_scheme}}',
        config.colorScheme || 'Warm Appetizing - Orange, red, yellow tones'
      )
      .replace(
        '{{typography_style}}',
        config.typographyStyle || 'Bold Sans Serif - Modern dan mudah dibaca'
      );
  } else {
    // Realistic/product style replacements
    prompt = prompt.replace(
      isFood ? '{{plating_style}}' : '{{product_style}}',
      config.platingStyle
    );
  }

  // Common replacements
  prompt = prompt
    .replace('{{background_style}}', config.backgroundStyle)
    .replace(
      '{{extra_instructions}}',
      config.extraInstructions || 'Tidak ada instruksi tambahan.'
    );

  return prompt;
};

export const generateProductPhotography = async (
  imageFile: File,
  config: GenerationConfig,
  isPoster: boolean = false
): Promise<GeneratedImage[]> => {
  if (!ai) {
    throw new Error(
      'API Gemini tidak tersedia. Silakan setup API key terlebih dahulu.'
    );
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPrompt = buildPrompt(config, true, isPoster);

    const generateSingleImage = async (): Promise<string> => {
      // Get user's AI settings
      const [userModel, userTemperature] = await Promise.all([
        getAIImageModelForAPI('gemini-3-pro'),
        getAITemperatureForAPI(0.4)
      ]);

      if (!ai) {
        // Fallback to mock if no AI instance
        const mockSvg = `
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
              Generated Image Demo
            </text>
            <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">
              Model: ${userModel}
            </text>
          </svg>
        `;
        const base64 = btoa(mockSvg);
        return `data:image/svg+xml;base64,${base64}`;
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

      const imagePartResponse = response.candidates?.[0]?.content?.parts!.find(
        (part) => part.inlineData
      );

      if (imagePartResponse && imagePartResponse.inlineData) {
        const base64ImageBytes = imagePartResponse.inlineData.data;
        const mimeType = imagePartResponse.inlineData.mimeType;

        // Validate base64 data
        if (!base64ImageBytes || base64ImageBytes.length === 0) {
          throw new Error('Data gambar kosong dari API');
        }

        // Log for debugging
        console.log('Generated image data length:', base64ImageBytes.length);
        console.log('Generated image mime type:', mimeType);

        const dataUrl = `data:${mimeType};base64,${base64ImageBytes}`;

        // Additional validation - check if it's a valid data URL
        if (!dataUrl.startsWith('data:image/')) {
          console.error(
            'Invalid image data URL:',
            dataUrl.substring(0, 100) + '...'
          );
          throw new Error('Format gambar tidak valid dari API');
        }

        return dataUrl;
      } else {
        const textResponse = response.text?.trim();
        console.warn(
          'API did not return an image. Text response:',
          textResponse
        );
        let errorMessage =
          'Gagal menghasilkan gambar. Coba sesuaikan prompt Anda atau gunakan gambar lain.';
        if (textResponse && textResponse.length > 10) {
          errorMessage = `Gagal menghasilkan gambar karena: "${textResponse}"`;
        }
        throw new Error(errorMessage);
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
  } catch (error) {
    console.error('Error generating images:', error);
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

  // Different colors for poster vs realistic
  const isPosterMode = isPoster || config.posterStyle;
  const fillColor1 = isPosterMode ? '%23fef3c7' : '%23f3f4f6'; // Yellow for poster, gray for realistic
  const fillColor2 = isPosterMode ? '%23fde68a' : '%23e5e7eb'; // Darker yellow for poster, lighter gray for realistic
  const imageType = isPosterMode ? 'Poster' : 'Image';
  const fillTextColor = isPosterMode ? '%2392400e' : '%236b7280'; // Brown for poster, gray for realistic

  const mockImages = [
    {
      imageUrl:
        `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${fillColor1}'/%3E%3Ctext x='50%25' y='35%25' font-family='Arial' font-size='16' font-weight='bold' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3EGenerated ${imageType} %231%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
        (config.imageSize?.name || 'Custom Size') +
        `%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Arial' font-size='10' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
        (config.imageSize?.dimensions || 'Custom') +
        '%3C/text%3E%3C/svg%3E',
      prompt: buildPrompt(config, true, isPosterMode),
      timestamp: new Date(),
      imageSize: config.imageSize,
    },
    {
      imageUrl:
        `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${fillColor2}'/%3E%3Ctext x='50%25' y='35%25' font-family='Arial' font-size='16' font-weight='bold' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3EGenerated ${imageType} %232%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
        (config.imageSize?.name || 'Custom Size') +
        `%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Arial' font-size='10' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
        (config.imageSize?.dimensions || 'Custom') +
        '%3C/text%3E%3C/svg%3E',
      prompt: buildPrompt(config, true, isPosterMode),
      timestamp: new Date(),
      imageSize: config.imageSize,
    },
  ];

  return mockImages;
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
