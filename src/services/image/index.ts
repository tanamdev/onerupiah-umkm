// Centralized exports for image generation services
export {
  buildRealisticFoodPrompt,
  validateRealisticFoodConfig,
  getDefaultRealisticFoodConfig,
  REALISTIC_FOOD_PROMPTS,
} from './realisticFoodService';

export {
  buildPosterPrompt,
  validatePosterConfig,
  getDefaultPosterConfig,
  POSTER_DESIGN_PROMPTS,
} from './posterService';

export {
  buildProductPrompt,
  validateProductConfig,
  getDefaultProductConfig,
  PRODUCT_PHOTOGRAPHY_PROMPTS,
} from './productService';

export {
  fileToGenerativePart,
  generateMockImages,
  validateImageFile,
  validateImageDataUrl,
  processAIResponse,
  extractAIErrorMessage,
  isPosterMode,
  isFoodMode,
  isProductMode,
} from './imageUtils';