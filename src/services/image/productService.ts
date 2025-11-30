import type { GenerationConfig } from '@/types/image';

// Product Photography Prompts
export const PRODUCT_PHOTOGRAPHY_PROMPTS = {
  PRODUCT_PROMPT_TEMPLATE: `Ubah foto produk ini menjadi sebuah karya fotografi profesional yang menarik dan berkualitas tinggi.

**Arahan Gaya:**
- **Gaya Produk:** {{product_style}}
- **Latar Belakang:** {{background_style}}
- **Jenis Produk:** {{product_type}}
- **Instruksi Tambahan:** {{extra_instructions}}

**Persyaratan Utama:**
1.  **Jaga Keasli:** Pertahankan bentuk, warna, dan detail produk asli.
2.  **Pencahayaan:** Sempurnakan pencahayaan agar produk terlihat menarik dan profesional.
3.  **Fotorealistis:** Hasilkan foto yang terlihat nyata dan berkualitas tinggi.
4.  **Fokus & Kedalaman:** Terapkan depth of field yang tepat untuk menonjolkan produk.
5.  **Komposisi:** Hasilkan komposisi yang menarik dan profesional.

**Yang Harus Dihindari:**
-   Jangan mengubah bentuk atau jenis produk.
-   Jangan tambahkan elemen yang tidak relevan.
-   Hindari efek kartun atau ilustrasi.
-   Jangan tambahkan teks apapun.

Hasilkan gambar PNG berkualitas tinggi.
`,

  // Product-specific style configurations
  PRODUCT_STYLES: [
    'Minimalis',
    'Premium luxury',
    'Casual',
    'Vintage',
    'Modern',
    'Traditional',
    'Food Photography',
    'Makanan Tradisional',
    'Culinary Professional',
    'Restaurant Style',
  ],

  PRODUCT_TYPES: [
    'Fashion & Pakaian',
    'Kuliner & Makanan',
    'Elektronik',
    'Kecantikan',
    'Peralatan Rumah',
    'Aksesoris',
    'Olahraga',
    'Lainnya',
  ],

  BACKGROUND_STYLES: [
    'Putih bersih',
    'Kayu gelap',
    'Marmer',
    'Konkret industrial',
    'Taman outdoor',
    'Dapur modern',
    'Restoran mewah',
    'Cafe cozy',
    'Studio backdrop',
    'Natural lighting',
  ],
};

// Build product photography prompt
export const buildProductPrompt = (config: GenerationConfig): string => {
  let prompt = PRODUCT_PHOTOGRAPHY_PROMPTS.PRODUCT_PROMPT_TEMPLATE;

  // Replace template variables
  prompt = prompt.replace(/{{product_style}}/g, config.productStyle || 'Minimalis');
  prompt = prompt.replace(/{{background_style}}/g, config.backgroundStyle || 'Putih bersih');
  prompt = prompt.replace(/{{product_type}}/g, config.productType || 'General Product');
  prompt = prompt.replace(
    /{{extra_instructions}}/g,
    config.extraInstructions || 'Tidak ada instruksi tambahan.'
  );

  return prompt;
};

// Validate product photography config
export const validateProductConfig = (config: GenerationConfig): boolean => {
  return !!(config.productStyle && config.backgroundStyle && config.productType);
};

// Get default product configuration
export const getDefaultProductConfig = (): Partial<GenerationConfig> => {
  return {
    productStyle: PRODUCT_PHOTOGRAPHY_PROMPTS.PRODUCT_STYLES[0],
    productType: PRODUCT_PHOTOGRAPHY_PROMPTS.PRODUCT_TYPES[0],
    backgroundStyle: PRODUCT_PHOTOGRAPHY_PROMPTS.BACKGROUND_STYLES[0],
    extraInstructions: 'Tidak ada instruksi tambahan.',
  };
};