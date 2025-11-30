import { GoogleGenAI, Modality } from '@google/genai';
import type { GenerationConfig, GeneratedImage } from '@/types/image';
import {
  SYSTEM_PROMPT_TEMPLATE,
  PRODUCT_PROMPT_TEMPLATE,
} from '@/constants/prompts';

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
  isFood: boolean = false
): string => {
  const template = isFood ? SYSTEM_PROMPT_TEMPLATE : PRODUCT_PROMPT_TEMPLATE;

  const prompt = template
    .replace(
      isFood ? '{{plating_style}}' : '{{product_style}}',
      config.platingStyle
    )
    .replace('{{background_style}}', config.backgroundStyle)
    .replace(
      '{{extra_instructions}}',
      config.extraInstructions || 'Tidak ada instruksi tambahan.'
    );

  return prompt;
};

export const generateProductPhotography = async (
  imageFile: File,
  config: GenerationConfig
): Promise<GeneratedImage[]> => {
  if (!ai) {
    throw new Error(
      'API Gemini tidak tersedia. Silakan setup API key terlebih dahulu.'
    );
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPrompt = buildPrompt(config);

    const generateSingleImage = async (): Promise<string> => {
      if (!ai) {
        // Fallback to mock if no AI instance
        const mockSvg = `
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
              Generated Image Demo
            </text>
            <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">
              ${textPrompt.substring(0, 50)}...
            </text>
          </svg>
        `;
        const base64 = btoa(mockSvg);
        return `data:image/svg+xml;base64,${base64}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: {
          parts: [imagePart, { text: textPrompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
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
  config: GenerationConfig
): Promise<GeneratedImage[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockImages = [
    {
      imageUrl:
        "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='40%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3EGenerated Image %231%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3E" +
        (config.imageSize?.name || 'Custom Size') +
        "%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Arial' font-size='10' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3E" +
        (config.imageSize?.dimensions || 'Custom') +
        '%3C/text%3E%3C/svg%3E',
      prompt: buildPrompt(config),
      timestamp: new Date(),
      imageSize: config.imageSize,
    },
    {
      imageUrl:
        "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='40%25' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3EGenerated Image %232%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3E" +
        (config.imageSize?.name || 'Custom Size') +
        "%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Arial' font-size='10' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3E" +
        (config.imageSize?.dimensions || 'Custom') +
        '%3C/text%3E%3C/svg%3E',
      prompt: buildPrompt(config),
      timestamp: new Date(),
      imageSize: config.imageSize,
    },
  ];

  return mockImages;
};

// Main function dengan fallback ke mock
export const generateImage = async (
  imageFile: File | null,
  config: GenerationConfig
): Promise<GeneratedImage[]> => {
  try {
    if (!imageFile || !ai) {
      // Fallback ke mock generation jika tidak ada file atau API key
      console.log('Using mock generation (no file or API key)');
      return await generateMockImages(config);
    }

    const images = await generateProductPhotography(imageFile, config);

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
    return await generateMockImages(config);
  }
};
