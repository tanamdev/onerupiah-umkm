# Image Generation Services

This directory contains modularized image generation services for better code maintenance and separation of concerns.

## 📁 File Structure

```
src/services/image/
├── index.ts                 # Central exports file
├── README.md               # This documentation
├── realisticFoodService.ts # Realistic food photography
├── posterService.ts        # Poster design generation
├── productService.ts       # Product photography
└── imageUtils.ts          # Shared utilities and helpers
```

## 🎯 Service Modules

### 1. Realistic Food Service (`realisticFoodService.ts`)
Handles realistic food photography generation.

**Features:**
- Realistic food photography prompts
- Food-specific style configurations
- Plating and background style options
- Validation and default configurations

**Main Functions:**
- `buildRealisticFoodPrompt(config: GenerationConfig)` - Build AI prompt for realistic food
- `validateRealisticFoodConfig(config: GenerationConfig)` - Validate configuration
- `getDefaultRealisticFoodConfig()` - Get default settings

### 2. Poster Service (`posterService.ts`)
Handles poster design generation for marketing materials.

**Features:**
- Poster-specific prompt templates
- Layout and typography configurations
- Color scheme and style options
- Professional design principles

**Main Functions:**
- `buildPosterPrompt(config: GenerationConfig)` - Build AI prompt for poster
- `validatePosterConfig(config: GenerationConfig)` - Validate poster configuration
- `getDefaultPosterConfig()` - Get default poster settings

### 3. Product Service (`productService.ts`)
Handles general product photography generation.

**Features:**
- Product photography prompts
- Industry-specific style options
- Background and lighting configurations
- E-commerce optimization

**Main Functions:**
- `buildProductPrompt(config: GenerationConfig)` - Build AI prompt for product
- `validateProductConfig(config: GenerationConfig)` - Validate product configuration
- `getDefaultProductConfig()` - Get default product settings

### 4. Image Utils (`imageUtils.ts`)
Contains shared utilities and helper functions.

**Features:**
- File processing utilities
- Image validation functions
- Mock image generation
- AI response processing
- Type guards and helpers

**Main Functions:**
- `fileToGenerativePart(file: File)` - Convert file for AI processing
- `validateImageFile(file: File)` - Validate image file
- `generateMockImages(config, count)` - Generate placeholder images
- `processAIResponse(response)` - Process AI API response

## 🔧 Usage

### Importing Services

```typescript
// Import specific services
import { buildRealisticFoodPrompt } from '@/services/image/realisticFoodService';
import { buildPosterPrompt } from '@/services/image/posterService';

// Import all from index
import {
  buildRealisticFoodPrompt,
  buildPosterPrompt,
  fileToGenerativePart,
  isPosterMode,
  isFoodMode
} from '@/services/image';
```

### Example Usage

```typescript
// Realistic Food Photography
const foodConfig = {
  foodName: 'Nasi Goreng',
  platingStyle: 'Modern Minimalis',
  backgroundStyle: 'Putih bersih'
};
const foodPrompt = buildRealisticFoodPrompt(foodConfig);

// Poster Design
const posterConfig = {
  foodName: 'Nasi Goreng',
  posterStyle: 'Modern Minimalist',
  layoutTemplate: 'Center Focus'
};
const posterPrompt = buildPosterPrompt(posterConfig);

// Type checking
if (isPosterMode(config)) {
  // Handle poster generation
} else if (isFoodMode(config)) {
  // Handle food photography
}
```

## 🎨 Configuration Options

### Realistic Food Styles
- Minimalis modern
- Klasik elegan
- Rustik natural
- Futuristik
- Tradisional Indonesia
- Kontemporer

### Poster Styles
- Modern Minimalist
- Bold & Vibrant
- Rustic Charm
- Vintage Retro
- Clean Professional
- Artistic Creative

### Product Styles
- Minimalis
- Premium luxury
- Casual
- Vintage
- Modern
- Traditional

## 🔄 Migration Guide

The original `imageService.ts` has been refactored to use these modular services:

**Before (Monolithic):**
```typescript
const buildPrompt = (config, isFood, isPoster) => {
  // Complex logic handling all modes
};
```

**After (Modular):**
```typescript
const buildPrompt = (config) => {
  if (isPosterMode(config)) {
    return buildPosterPrompt(config);
  } else if (isFoodMode(config)) {
    return buildRealisticFoodPrompt(config);
  }
  // ...etc
};
```

## 🚀 Benefits

1. **Better Maintainability**: Each service is focused on a specific use case
2. **Easier Testing**: Individual services can be tested in isolation
3. **Code Reusability**: Utilities are shared across services
4. **Type Safety**: Specific configurations for each mode
5. **Scalability**: Easy to add new image generation modes
6. **Clear Separation**: Business logic is separated by concern

## 🛠️ Development

When adding new features:

1. **New Image Mode**: Create a new service file following the same pattern
2. **Shared Utilities**: Add to `imageUtils.ts`
3. **Constants**: Add to the respective service file
4. **Exports**: Update `index.ts` for public API

## 📝 Future Enhancements

- Add more specific image generation modes (e.g., logo design, social media templates)
- Implement advanced image validation
- Add caching for frequently used prompts
- Support for multiple AI providers
- Batch processing capabilities