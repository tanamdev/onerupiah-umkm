import type { GenerationConfig } from '@/types/image';

// Realistic Food Photography Prompts
export const REALISTIC_FOOD_PROMPTS = {
  SYSTEM_PROMPT_TEMPLATE: `Ubah foto makanan ini menjadi sebuah karya fotografi profesional yang realistis dan menggugah selera.

**Detail Makanan:**
- **Nama Makanan:** {{food_name}}

**Arahan Gaya:**
- **Gaya Plating:** {{plating_style}}
- **Latar Belakang:** {{background_style}}
- **Instruksi Tambahan:** {{extra_instructions}}

**Persyaratan Utama:**
1.  **Identifikasi Makanan:** Fokus pada {{food_name}} dengan karakteristik khasnya. Pertahankan esensi dan keunikan hidangan asli.
2.  **Jaga Keaslian:** Pertahankan bentuk, warna, dan tekstur makanan asli. Jangan mengganti hidangan.
3.  **Pencahayaan:** Sempurnakan pencahayaan agar dramatis namun tetap natural, khas fotografi makanan kelas atas. Buat terlihat lezat dan menggugah selera.
4.  **Fotorealistis:** Gaya plating dan latar belakang harus terlihat sangat nyata dengan detail {{food_name}} yang presisi dengan dengan Angle (0-15 Derajat) atau The 45-Degree Angle.
5.  **Fokus & Kedalaman:** Terapkan depth of field (bokeh lembut) untuk menonjolkan {{food_name}} sebagai subjek utama.
6.  **Komposisi:** Hasilkan sedikit variasi sudut atau komposisi untuk menampilkan keindahan {{food_name}} dari berbagai angle.
7.  **Appetizing Appeal:** Tampilkan {{food_name}} dalam kondisi paling menarik dengan warna-warna cerah dan penataan yang rapi.

**Yang Harus Dihindari:**
-   Jangan mengubah jenis makanan. Pertahankan identitas {{food_name}}.
-   Jangan tambahkan elemen atau hiasan yang tidak relevan dengan {{food_name}}.
-   Hindari efek kartun, ilustrasi, atau HDR yang berlebihan. Hasilnya harus tampak seperti foto asli.
-   Jangan tambahkan teks apapun.

**Target:** Fotografi {{food_name}} profesional yang bisa digunakan untuk menu restoran, food blog, atau social media marketing.
Hasilkan gambar PNG berkualitas tinggi.
`,

  // Style-specific configurations for realistic food photography
  PLATING_STYLES: [
    'Minimalis modern',
    'Klasik elegan',
    'Rustik natural',
    'Futuristik',
    'Tradisional Indonesia',
    'Kontemporer',
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
  ],
};

// Build realistic food photography prompt
export const buildRealisticFoodPrompt = (config: GenerationConfig): string => {
  let prompt = REALISTIC_FOOD_PROMPTS.SYSTEM_PROMPT_TEMPLATE;

  // Replace template variables
  prompt = prompt.replace(/{{food_name}}/g, config.foodName || 'makanan');
  prompt = prompt.replace(/{{plating_style}}/g, config.platingStyle || 'Minimalis modern');
  prompt = prompt.replace(/{{background_style}}/g, config.backgroundStyle || 'Putih bersih');
  prompt = prompt.replace(
    /{{extra_instructions}}/g,
    config.extraInstructions || 'Tidak ada instruksi tambahan.'
  );

  return prompt;
};

// Validate realistic food photography config
export const validateRealisticFoodConfig = (config: GenerationConfig): boolean => {
  return !!(config.foodName && config.platingStyle && config.backgroundStyle);
};

// Get default realistic food configuration
export const getDefaultRealisticFoodConfig = (): Partial<GenerationConfig> => {
  return {
    platingStyle: REALISTIC_FOOD_PROMPTS.PLATING_STYLES[0],
    backgroundStyle: REALISTIC_FOOD_PROMPTS.BACKGROUND_STYLES[0],
    extraInstructions: 'Tidak ada instruksi tambahan.',
  };
};