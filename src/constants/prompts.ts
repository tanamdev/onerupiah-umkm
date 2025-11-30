export const SYSTEM_PROMPT_TEMPLATE = `Ubah foto makanan ini menjadi sebuah karya fotografi profesional yang realistis dan menggugah selera.

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
`;

// Template untuk general product photography
export const PRODUCT_PROMPT_TEMPLATE = `Ubah foto produk ini menjadi sebuah karya fotografi profesional yang menarik dan berkualitas tinggi.

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
`;

// Template untuk poster design
export const POSTER_PROMPT_TEMPLATE = `Ubah foto makanan ini menjadi poster yang menarik dan profesional untuk promosi kuliner.

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
`;

export const PLATING_STYLES = [
  'Minimalis modern',
  'Klasik elegan',
  'Rustik natural',
  'Futuristik',
  'Tradisional Indonesia',
  'Kontemporer',
];

export const BACKGROUND_STYLES = [
  'Putih bersih',
  'Kayu gelap',
  'Marmer',
  'Konkret industrial',
  'Taman outdoor',
  'Dapur modern',
  'Restoran mewah',
  'Cafe cozy',
];

export const PRODUCT_STYLES = [
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
];

export const PRODUCT_TYPES = [
  'Fashion & Pakaian',
  'Kuliner & Makanan',
  'Elektronik',
  'Kecantikan',
  'Peralatan Rumah',
  'Aksesoris',
  'Olahraga',
  'Lainnya',
];

// Poster-specific constants
export const POSTER_STYLES = [
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
];

export const POSTER_LAYOUT_TEMPLATES = [
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
];

export const POSTER_COLOR_SCHEMES = [
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
];

export const POSTER_TYPOGRAPHY_STYLES = [
  'Bold Sans Serif - Modern dan mudah dibaca',
  'Elegant Serif - Classic dan sophisticated',
  'Playful Script - Casual dan friendly',
  'Minimal Typography - Clean dan simple',
  'Statement Headline - Large, bold text',
  'Subtle Text - Small dan non-intrusive',
  'Vintage Font - Retro dan nostalgic',
  'Tech Modern - Futuristic dan clean'
];

// Image Size Options
export const IMAGE_SIZES = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    ratio: '1:1',
    dimensions: '1080x1080px',
    description: 'Instagram feed posting',
    width: 1080,
    height: 1080,
    category: 'Social Media',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    ratio: '9:16',
    dimensions: '1080x1920px',
    description: 'Instagram Stories & Reels',
    width: 1080,
    height: 1920,
    category: 'Social Media',
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    ratio: '16:9',
    dimensions: '1200x630px',
    description: 'Facebook link sharing',
    width: 1200,
    height: 630,
    category: 'Social Media',
  },
  {
    id: 'whatsapp-status',
    name: 'WhatsApp Status',
    ratio: '1:1',
    dimensions: '1080x1080px',
    description: 'WhatsApp status updates',
    width: 1080,
    height: 1080,
    category: 'Messaging',
  },
  {
    id: 'product-thumbnail',
    name: 'Product Thumbnail',
    ratio: '1:1',
    dimensions: '800x800px',
    description: 'E-commerce product images',
    width: 800,
    height: 800,
    category: 'E-commerce',
  },
  {
    id: 'product-banner',
    name: 'Product Banner',
    ratio: '3:2',
    dimensions: '1200x800px',
    description: 'Product banners & headers',
    width: 1200,
    height: 800,
    category: 'E-commerce',
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    ratio: '16:9',
    dimensions: '1280x720px',
    description: 'YouTube video thumbnails',
    width: 1280,
    height: 720,
    category: 'Video',
  },
  {
    id: 'web-banner',
    name: 'Web Banner',
    ratio: '2:1',
    dimensions: '1920x960px',
    description: 'Website headers & banners',
    width: 1920,
    height: 960,
    category: 'Web',
  },
  {
    id: 'print-flyer',
    name: 'Print Flyer',
    ratio: 'A4',
    dimensions: '2480x3508px',
    description: 'Flyer & brochure printing',
    width: 2480,
    height: 3508,
    category: 'Print',
  },
  {
    id: 'business-card',
    name: 'Business Card',
    ratio: '1.75:1',
    dimensions: '1050x600px',
    description: 'Standard business card',
    width: 1050,
    height: 600,
    category: 'Print',
  },
  {
    id: 'logo-square',
    name: 'Logo Square',
    ratio: '1:1',
    dimensions: '512x512px',
    description: 'Square logo for profiles',
    width: 512,
    height: 512,
    category: 'Branding',
  },
  {
    id: 'logo-wide',
    name: 'Logo Wide',
    ratio: '3:1',
    dimensions: '1200x400px',
    description: 'Wide logo for headers',
    width: 1200,
    height: 400,
    category: 'Branding',
  },
];

// Group sizes by category
export const IMAGE_SIZE_CATEGORIES = [
  {
    name: 'Social Media',
    description: 'Optimal untuk Instagram, Facebook, WhatsApp',
    icon: '📱',
  },
  {
    name: 'E-commerce',
    description: 'Product images untuk marketplace',
    icon: '🛒',
  },
  {
    name: 'Video',
    description: 'YouTube & video content thumbnails',
    icon: '🎬',
  },
  {
    name: 'Web',
    description: 'Website banners dan headers',
    icon: '🌐',
  },
  {
    name: 'Print',
    description: 'Material printing & dokumen',
    icon: '🖨️',
  },
  {
    name: 'Branding',
    description: 'Logo dan identitas visual',
    icon: '🏷️',
  },
];
