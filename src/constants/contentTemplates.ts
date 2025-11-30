// Content Type Templates
export const CONTENT_TEMPLATES = {
  caption: {
    name: 'Instagram Caption',
    prompt: `Buat caption Instagram yang engaging dan profesional untuk:

**Produk/Jasa:** {{product}}
**Target Audience:** {{targetAudience}}
**Tone:** {{tone}}
**Keywords:** {{keywords}}
**Platform:** {{platform}}

**Requirements:**
1. Hook pembuka yang menarik perhatian (emoji + bold statement)
2. Deskripsi produk yang benefits-oriented (fokus pada manfaat, bukan fitur)
3. Call-to-action yang jelas dan persuasive
4. 5-7 hashtags yang relevan dan trending
5. Max 2-3 paragraf, singkat dan padat
6. Gunakan emoji yang sesuai dan tidak berlebihan
7. Bahasa Indonesia yang natural dan conversational

**Format Output:**
[Hook] + [Deskripsi] + [CTA] + [Hashtags]

Pastikan caption tersebut sesuai dengan tone {{tone}} dan engaging untuk audience {{targetAudience}}.`,

    variables: ['product', 'targetAudience', 'tone', 'keywords', 'platform'],
  },

  blog: {
    name: 'Blog Post',
    prompt: `Tulis blog post yang informatif dan engaging dengan topik:

**Topik/Produk:** {{product}}
**Target Audience:** {{targetAudience}}
**Tone:** {{tone}}
**Keywords:** {{keywords}}

**Structure Requirements:**
1. **Title:** Menarik, mengandung keywords, max 60 karakter
2. **Introduction:** Hook kuat, jelaskan problem yang akan dibahas
3. **Body:** 3-4 subheadings dengan penjelasan detail
4. **Benefits:** Section khusus untuk manfaat
5. **Conclusion:** Summary dan call-to-action
6. **Word count:** 800-1200 kata
7. **SEO optimized:** Natural keyword placement

**Tone Guidelines ({{tone}}):**
- Professional: Formal, data-driven, authoritative
- Casual: Friendly, conversational, personal
- Persuasive: Emotional, benefit-focused, action-oriented

Tulis blog post yang lengkap dan well-structured.`,

    variables: ['product', 'targetAudience', 'tone', 'keywords'],
  },

  email: {
    name: 'Email Marketing',
    prompt: `Buat email marketing yang konversi tinggi untuk:

**Produk/Jasa:** {{product}}
**Target Audience:** {{targetAudience}}
**Tone:** {{tone}}
**Keywords:** {{keywords}}

**Email Structure:**
1. **Subject Line:** Catchy, personal, max 50 karakter
2. **Preview Text:** Hook untuk buka email, max 80 karakter
3. **Opening:** Personal greeting dan relevance statement
4. **Body:** 2-3 paragraf dengan benefits dan social proof
5. **Offer:** Special value proposition atau urgency
6. **CTA:** Clear action button dengan benefit statement
7. **P.S.:** Additional incentive atau reminder

**Best Practices:**
- Personalization dengan nama atau segment
- One primary CTA per email
- Mobile-responsive format
- Spam-free language
- Value-first approach

Hasilkan email marketing yang profesional dan konversi-focused.`,

    variables: ['product', 'targetAudience', 'tone', 'keywords'],
  },

  social: {
    name: 'Social Media Content',
    prompt: `Buat konten social media yang viral-worthy untuk:

**Platform:** {{platform}}
**Produk/Jasa:** {{product}}
**Target Audience:** {{targetAudience}}
**Tone:** {{tone}}
**Keywords:** {{keywords}}

**Platform-Specific Guidelines:**
- **Instagram:** Visual-focused, storytelling, hashtags 5-10
- **Facebook:** Community-focused, longer copy, emotional appeal
- **Twitter:** Concise, trending hashtags, 280 char limit
- **TikTok:** Trending format, hook-based, entertainment value

**Content Elements:**
1. Hook pertama 2-3 detik
2. Value proposition yang jelas
3. Social proof atau user-generated content
4. Clear engagement question atau prompt
5. Platform-appropriate formatting

**Viral Triggers:**
- Emotional appeal (humor, inspiration, surprise)
- Trending topics or challenges
- Interactive elements (polls, questions)
- User-generated content potential

Buat konten yang platform-optimized dan engagement-focused.`,

    variables: ['platform', 'product', 'targetAudience', 'tone', 'keywords'],
  },
};

// Platform configurations
export const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    maxCharacters: 2200,
    supportedContentTypes: ['caption', 'social'],
    hashtagsRecommended: 5,
    features: ['visual_content', 'stories', 'reels', 'hashtags'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    maxCharacters: 63206,
    supportedContentTypes: ['caption', 'social', 'blog'],
    hashtagsRecommended: 3,
    features: ['long_form', 'community', 'groups', 'ads'],
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    maxCharacters: 280,
    supportedContentTypes: ['social', 'caption'],
    hashtagsRecommended: 2,
    features: ['real_time', 'trending', 'threads'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    maxCharacters: 150,
    supportedContentTypes: ['social'],
    hashtagsRecommended: 5,
    features: ['video_content', 'trending', 'music', 'effects'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    maxCharacters: 3000,
    supportedContentTypes: ['blog', 'social'],
    hashtagsRecommended: 3,
    features: ['professional', 'business', 'networking'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    maxCharacters: 500,
    supportedContentTypes: ['caption', 'social'],
    hashtagsRecommended: 5,
    features: ['visual_discovery', 'pins', 'boards'],
  },
];

// Tone configurations
export const TONES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal, authoritative, dan business-focused',
    characteristics: ['formal language', 'data-driven', 'expert positioning', 'trust building'],
    keywords: ['solution', 'professional', 'expert', 'quality', 'reliable'],
  },
  {
    id: 'casual',
    name: 'Casual & Friendly',
    description: 'Relatable, conversational, dan approachable',
    characteristics: ['informal language', 'personal touch', 'friendly tone', 'relatable'],
    keywords: ['guys', 'love', 'awesome', 'perfect', 'friendly'],
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    description: 'Convincing, action-oriented, dan compelling',
    characteristics: ['emotional appeal', 'urgency', 'benefit focus', 'action words'],
    keywords: ['now', 'transform', 'discover', 'exclusive', 'limited'],
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Informative, helpful, dan knowledge-sharing',
    characteristics: ['teaching tone', 'step-by-step', 'tips sharing', 'value education'],
    keywords: ['learn', 'guide', 'tips', 'how-to', 'knowledge'],
  },
  {
    id: 'inspirational',
    name: 'Inspirational',
    description: 'Motivating, uplifting, dan positive',
    characteristics: ['emotional storytelling', 'success stories', 'empowerment', 'dream building'],
    keywords: ['dream', 'success', 'inspire', 'achieve', 'transform'],
  },
  {
    id: 'humorous',
    name: 'Humorous',
    description: 'Funny, entertaining, dan memorable',
    characteristics: ['wit', 'relatable humor', 'light-hearted', 'viral potential'],
    keywords: ['funny', 'lol', 'hilarious', 'meme', 'entertaining'],
  },
];

// Target audience options
export const TARGET_AUDIENCES = [
  {
    id: 'women_20_35',
    name: 'Wanita 20-35 tahun',
    description: 'Young adult women with modern lifestyle',
    keywords: ['fashion', 'beauty', 'lifestyle', 'career', 'family'],
  },
  {
    id: 'men_25_40',
    name: 'Pria 25-40 tahun',
    description: 'Adult men focused on career and lifestyle',
    keywords: ['professional', 'tech', 'gadget', 'career', 'fitness'],
  },
  {
    id: 'teens_15_20',
    name: 'Remaja 15-20 tahun',
    description: 'Teenagers with digital-native behavior',
    keywords: ['trending', 'viral', 'social', 'entertainment', 'education'],
  },
  {
    id: 'parents_30_45',
    name: 'Parents 30-45 tahun',
    description: 'Parents with family-focused priorities',
    keywords: ['family', 'kids', 'education', 'health', 'home'],
  },
  {
    id: 'general',
    name: 'General',
    description: 'Broad audience with diverse interests',
    keywords: ['general', 'universal', 'everyone', 'lifestyle', 'quality'],
  },
  {
    id: 'business_b2b',
    name: 'Business B2B',
    description: 'Business professionals and decision makers',
    keywords: ['business', 'professional', 'efficiency', 'growth', 'solution'],
  },
];

// Template suggestions
export const TEMPLATE_SUGGESTIONS = [
  {
    id: 'behind_scenes',
    name: 'Behind the Scenes',
    description: 'Show production process and team',
    contentType: 'social',
    platforms: ['instagram', 'tiktok'],
  },
  {
    id: 'customer_testimonial',
    name: 'Customer Testimonial',
    description: 'Share authentic customer reviews',
    contentType: 'caption',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 'educational_content',
    name: 'Educational Content',
    description: 'Tips, tutorials, and how-to guides',
    contentType: 'blog',
    platforms: ['instagram', 'facebook', 'linkedin'],
  },
  {
    id: 'product_launch',
    name: 'Product Launch',
    description: 'Announce new products or features',
    contentType: 'email',
    platforms: ['email', 'social'],
  },
  {
    id: 'seasonal_promotion',
    name: 'Seasonal Promotion',
    description: 'Holiday and seasonal themed content',
    contentType: 'caption',
    platforms: ['instagram', 'facebook', 'email'],
  },
  {
    id: 'interactive_poll',
    name: 'Interactive Poll/Q&A',
    description: 'Engage audience with questions',
    contentType: 'social',
    platforms: ['instagram', 'twitter', 'facebook'],
  },
];