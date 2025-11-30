import type { GenerationConfig } from '@/types/image';

// Poster Design Prompts and Configurations
export const POSTER_DESIGN_PROMPTS = {
  POSTER_PROMPT_TEMPLATE: `Ubah foto makanan ini menjadi poster yang menarik dan profesional untuk promosi kuliner.

**Detail Produk:**
- **Nama Makanan:** {{food_name}}
- **Target Audience:** General food lovers, social media users
- **Platform Use:** Instagram, WhatsApp, menu digital

**Arahan Design Poster:**
- **Gaya Poster:** {{poster_style}}
- **Layout Template:** {{layout_template}}
- **Color Scheme:** {{color_scheme}}
- **Typography:** {{typography_style}}
- **Background Style:** {{background_style}}
- **Instruksi Tambahan:** {{extra_instructions}}

**Persyaratan Utama Poster:**
1.  **Visual Impact:** Ciptakan poster yang eye-catching dan mudah menarik perhatian di social media feed
2.  **Appetizing Appeal:** Tingkatkan warna dan kontras agar makanan terlihat sangat menggugah selera
3.  **Clean Composition:** Pastikan {{food_name}} menjadi focal point yang jelas
4.  **Professional Design:** Gunakan prinsip design poster yang baik (balance, hierarchy, contrast)
5.  **Brand Consistency:** Pertahankan identitas visual yang konsisten
6.  **Social Media Ready:** Hasilkan poster yang bekerja dengan baik di platform digital
7.  **Appropriate Enhancement:** Boleh tambahkan subtle design elements, shadows, atau effects yang meningkatkan visual appeal

**Technical Requirements:**
- High resolution yang tajam
- Warna vibrant dan appetizing
- Komposisi yang seimbang
- Negative space yang cukup untuk keterbacaan
- Contrast yang baik untuk visibility

**Yang Diperbolehkan untuk Poster:**
- Moderate enhancement warna untuk membuat makanan lebih appetizing
- Subtle graphic elements atau background patterns
- Professional lighting effects
- Komposisi yang lebih dramatis daripada foto realistis
- Color grading untuk mood yang tepat

**Yang Harus Dihindari:**
- Jangan ubah identitas {{food_name}} secara drastis
- Hindari text atau typography yang mengganggu visual makanan
- Jangan tambahkan effects yang berlebihan (cartoonish atau unrealistic)
- Hindari clutter atau terlalu banyak elements
- Jangan tambahkan watermark atau branding yang tidak relevan

**Target Output:** Poster kuliner profesional yang siap untuk social media marketing, menu digital, atau promosi online.
Hasilkan gambar berkualitas tinggi dengan format visual poster yang menarik.
`,

  // Poster-specific style configurations
  POSTER_STYLES: [
    'Modern Minimalist',
    'Bold & Vibrant',
    'Rustic Charm',
    'Vintage Retro',
    'Clean Professional',
    'Artistic Creative',
    'Dramatic Lighting',
    'Warm & Cozy',
    'Fresh & Natural',
    'Premium Luxury'
  ],

  POSTER_LAYOUT_TEMPLATES: [
    'Center Focus - Product sebagai hero di tengah',
    'Rule of Thirds - Product di titik fokus 1/3',
    'Diagonal Dynamic - Komposisi diagonal yang energik',
    'Top Heavy - Product di bagian atas dengan space di bawah',
    'Bottom Focus - Product di bagian bawah dengan headline space',
    'Corner Balance - Product di sudut dengan elemen penyeimbang',
    'Symmetric - Komposisi simetris yang formal',
    'Asymmetric - Komposisi asimetris yang modern',
    'Full Frame - Product memenuhi sebagian besar frame',
    'Breathing Room - Product dengan banyak negative space'
  ],

  POSTER_COLOR_SCHEMES: [
    'Warm Appetizing - Orange, red, yellow tones',
    'Fresh Natural - Green, white, light brown tones',
    'Modern Monochrome - Black, white, gray with accent',
    'Premium Luxury - Gold, black, deep blue tones',
    'Vibrant Bold - Bright, saturated colors',
    'Pastel Soft - Light, gentle colors',
    'Earth Tones - Brown, beige, green natural colors',
    'Cool Professional - Blue, gray, white tones',
    'Sunset Gradient - Orange to pink gradient',
    'Forest Fresh - Deep green and brown tones'
  ],

  POSTER_TYPOGRAPHY_STYLES: [
    'Bold Sans Serif - Modern dan mudah dibaca',
    'Elegant Serif - Classic dan sophisticated',
    'Playful Script - Casual dan friendly',
    'Minimal Typography - Clean dan simple',
    'Statement Headline - Large, bold text',
    'Subtle Text - Small dan non-intrusive',
    'Vintage Font - Retro dan nostalgic',
    'Tech Modern - Futuristic dan clean'
  ],
};

// Build poster design prompt
export const buildPosterPrompt = (config: GenerationConfig): string => {
  let prompt = POSTER_DESIGN_PROMPTS.POSTER_PROMPT_TEMPLATE;

  // Replace template variables
  prompt = prompt.replace(/{{food_name}}/g, config.foodName || 'makanan');
  prompt = prompt.replace(/{{poster_style}}/g, config.posterStyle || 'Modern Minimalist');
  prompt = prompt.replace(
    /{{layout_template}}/g,
    config.layoutTemplate || 'Center Focus - Product sebagai hero di tengah'
  );
  prompt = prompt.replace(
    /{{color_scheme}}/g,
    config.colorScheme || 'Warm Appetizing - Orange, red, yellow tones'
  );
  prompt = prompt.replace(
    /{{typography_style}}/g,
    config.typographyStyle || 'Bold Sans Serif - Modern dan mudah dibaca'
  );
  prompt = prompt.replace(/{{background_style}}/g, config.backgroundStyle || 'Clean solid background');
  prompt = prompt.replace(
    /{{extra_instructions}}/g,
    config.extraInstructions || 'Tidak ada instruksi tambahan.'
  );

  return prompt;
};

// Validate poster design config
export const validatePosterConfig = (config: GenerationConfig): boolean => {
  return !!(
    config.foodName &&
    config.posterStyle &&
    config.layoutTemplate &&
    config.colorScheme &&
    config.typographyStyle
  );
};

// Get default poster configuration
export const getDefaultPosterConfig = (): Partial<GenerationConfig> => {
  return {
    posterStyle: POSTER_DESIGN_PROMPTS.POSTER_STYLES[0],
    layoutTemplate: POSTER_DESIGN_PROMPTS.POSTER_LAYOUT_TEMPLATES[0],
    colorScheme: POSTER_DESIGN_PROMPTS.POSTER_COLOR_SCHEMES[0],
    typographyStyle: POSTER_DESIGN_PROMPTS.POSTER_TYPOGRAPHY_STYLES[0],
    backgroundStyle: 'Clean solid background',
    extraInstructions: 'Tidak ada instruksi tambahan.',
  };
};