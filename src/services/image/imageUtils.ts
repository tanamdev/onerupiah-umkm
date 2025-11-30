import type { GenerationConfig } from '@/types/image';

// Image file processing utilities
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Image validation utilities
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File harus berupa gambar dengan format JPEG, PNG, atau WebP'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 10MB'
    };
  }

  // Check minimum file size (100KB)
  const minSize = 100 * 1024; // 100KB in bytes
  if (file.size < minSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu kecil. Minimal 100KB'
    };
  }

  return { isValid: true };
};

// Mock image generation for fallback
export const generateMockImage = (
  config: GenerationConfig,
  index: number,
  total: number
): string => {
  const isPosterMode = config.posterStyle;
  const fillColor1 = isPosterMode ? '%23fef3c7' : '%23f3f4f6';
  const fillColor2 = isPosterMode ? '%23fde68a' : '%23e5e7eb';
  const imageType = isPosterMode ? 'Poster' : 'Image';
  const fillTextColor = isPosterMode ? '%2392400e' : '%236b7280';

  return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${index % 2 === 0 ? fillColor1 : fillColor2}'/%3E%3Ctext x='50%25' y='35%25' font-family='Arial' font-size='16' font-weight='bold' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3EGenerated ${imageType} #%24{index + 1}%3C/text%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
    (config.imageSize?.name || 'Custom Size') +
    `%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Arial' font-size='10' fill='${fillTextColor}' text-anchor='middle' dy='.3em'%3E` +
    (config.imageSize?.dimensions || 'Custom') +
    '%3C/text%3E%3C/svg%3E';
};

// Generate multiple mock images
export const generateMockImages = (
  config: GenerationConfig,
  isPoster: boolean = false,
  count: number = 2
): Array<{ imageUrl: string; prompt: string; timestamp: Date; imageSize?: any }> => {
  return Array.from({ length: count }, (_, index) => ({
    imageUrl: generateMockImage(config, index, count),
    prompt: `Mock ${isPoster ? 'Poster' : 'Image'} generation ${index + 1}`,
    timestamp: new Date(),
    imageSize: config.imageSize,
  }));
};

// Validate data URL format
export const validateImageDataUrl = (dataUrl: string): boolean => {
  if (!dataUrl.startsWith('data:image/')) {
    return false;
  }

  const parts = dataUrl.split(',');
  if (parts.length !== 2) {
    return false;
  }

  const mimeType = parts[0].split(':')[1].split(';')[0];
  const validMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

  return validMimeTypes.includes(mimeType);
};

// Process and validate AI response
export const processAIResponse = (response: any): string => {
  const imagePartResponse = response.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData
  );

  if (!imagePartResponse?.inlineData) {
    throw new Error('AI tidak mengembalikan gambar yang valid');
  }

  const base64ImageBytes = imagePartResponse.inlineData.data;
  const mimeType = imagePartResponse.inlineData.mimeType;

  // Validate base64 data
  if (!base64ImageBytes || base64ImageBytes.length === 0) {
    throw new Error('Data gambar kosong dari AI');
  }

  const dataUrl = `data:${mimeType};base64,${base64ImageBytes}`;

  // Validate data URL format
  if (!validateImageDataUrl(dataUrl)) {
    throw new Error('Format gambar tidak valid dari AI');
  }

  return dataUrl;
};

// Get error message from AI text response
export const extractAIErrorMessage = (textResponse?: string): string => {
  if (!textResponse || textResponse.length <= 10) {
    return 'Gagal menghasilkan gambar. Coba sesuaikan prompt Anda atau gunakan gambar lain.';
  }

  return `Gagal menghasilkan gambar karena: "${textResponse}"`;
};

// Type guard for image generation mode
export const isPosterMode = (config: GenerationConfig): boolean => {
  // More specific check - only true if ALL poster fields are set
  return !!(
    config.posterStyle &&
    config.layoutTemplate &&
    config.colorScheme &&
    config.typographyStyle
  );
};

// Type guard for food mode
export const isFoodMode = (config: GenerationConfig): boolean => {
  return !!config.foodName && !!config.platingStyle;
};

// Type guard for product mode
export const isProductMode = (config: GenerationConfig): boolean => {
  return !!config.productStyle && !!config.productType;
};