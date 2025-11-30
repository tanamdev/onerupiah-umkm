import { GoogleGenAI, Modality } from '@google/genai';
import type { ContentGenerationConfig, GeneratedContent } from '@/types/content';
import { CONTENT_TEMPLATES, PLATFORMS, TONES, TARGET_AUDIENCES } from '@/constants/contentTemplates';
import { getAIModelForAPI, getAITemperatureForAPI, getAIMaxTokensForAPI, getAIApiKey } from '@/lib/ai-settings';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Build prompt based on content type and configuration
const buildContentPrompt = (config: ContentGenerationConfig): string => {
  const template = CONTENT_TEMPLATES[config.contentType];

  if (!template) {
    throw new Error(`Template not found for content type: ${config.contentType}`);
  }

  let prompt = template.prompt;

  // Replace template variables
  prompt = prompt.replace(/{{product}}/g, config.product);
  prompt = prompt.replace(/{{targetAudience}}/g, config.targetAudience);
  prompt = prompt.replace(/{{tone}}/g, config.tone);
  prompt = prompt.replace(/{{keywords}}/g, config.keywords || 'Tidak ada keywords spesifik');
  prompt = prompt.replace(/{{platform}}/g, config.platforms.join(', '));
  prompt = prompt.replace(/{{extraInstructions}}/g, config.extraInstructions || 'Tidak ada instruksi tambahan');

  return prompt;
};

// Extract hashtags from generated content
const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g;
  const matches = content.match(hashtagRegex);
  return matches || [];
};

// Extract title from blog post content
const extractTitle = (content: string): string | undefined => {
  const lines = content.split('\n');
  const titleLine = lines.find(line =>
    line.trim().length > 0 &&
    line.trim().length < 100 &&
    !line.includes('**') &&
    !line.includes('#')
  );
  return titleLine?.trim();
};

// Generate content using AI
export const generateContent = async (
  config: ContentGenerationConfig
): Promise<GeneratedContent> => {
  if (!ai) {
    // Fallback to mock generation
    return generateMockContent(config);
  }

  try {
    // Get user's AI settings
    const [userModel, userTemperature, userMaxTokens] = await Promise.all([
      getAIModelForAPI('gemini-3-pro'),
      getAITemperatureForAPI(0.7),
      getAIMaxTokensForAPI(2048)
    ]);

    const prompt = buildContentPrompt(config);
    console.log('Generating content with settings:', {
      contentType: config.contentType,
      tone: config.tone,
      platform: config.platforms,
      model: userModel,
      temperature: userTemperature,
      maxTokens: userMaxTokens
    });

    const response = await ai.models.generateContent({
      model: userModel,
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT],
        temperature: userTemperature,
        maxOutputTokens: userMaxTokens,
      },
    });

    const generatedText = response.text?.trim();

    if (!generatedText) {
      throw new Error('AI generated empty content');
    }

    // Create generated content object
    const generatedContent: GeneratedContent = {
      id: Date.now().toString(),
      content: generatedText,
      contentType: config.contentType,
      title: config.contentType === 'blog' ? extractTitle(generatedText) : undefined,
      hashtags: config.contentType === 'caption' || config.contentType === 'social' ? extractHashtags(generatedText) : undefined,
      platform: config.platforms[0],
      tone: config.tone,
      wordCount: generatedText.split(/\s+/).length,
      timestamp: new Date(),
      config: { ...config },
    };

    return generatedContent;

  } catch (error) {
    console.error('Error generating content:', error);

    // Fallback to mock generation
    return generateMockContent(config);
  }
};

// Mock content generation for fallback
const generateMockContent = (config: ContentGenerationConfig): GeneratedContent => {
  const mockContents: Record<string, string> = {
    caption: `✨ ${config.product.toUpperCase()} - PILIHAN TERBAIK UNTUK ${config.targetAudience.toUpperCase()}! ✨

Temukan ${config.product} dengan kualitas premium yang dirancang khusus untuk Anda.

🌟 Benefits:
• Kualitas terjamin
• Harga terjangkau
• Pengiriman cepat

Buruan pesan sekarang juga! Stok terbatas! 🚀

${config.keywords ? config.keywords.split(',').slice(0, 5).map(tag => `#${tag.trim()}`).join(' #') : '#quality #premium #terbaik'}

#promosi #diskon #limitedoffer`,

    blog: `**${config.product}: Panduan Lengkap untuk ${config.targetAudience}**

**Pendahuluan**
Dalam era digital saat ini, menemukan ${config.product} yang tepat menjadi tantangan tersendiri bagi ${config.targetAudience}. Artikel ini akan membahas secara mendalam mengenai hal tersebut.

**Mengapa ${config.product} Penting?**
${config.product} memegang peranan krusial dalam kehidupan sehari-hari. Banyak ${config.targetAudience} yang sudah merasakan manfaatnya secara langsung.

**Tips Memilih ${config.product} yang Tepat**
1. Perhatikan kualitas
2. Sesuaikan dengan kebutuhan
3. Pertimbangkan budget
4. Cek review dan testimonial

**Kesimpulan**
${config.product} adalah investasi yang berharga untuk ${config.targetAudience}. Dengan memilih yang tepat, Anda akan mendapatkan hasil maksimal.`,

    email: `**Subject:** 🎥 Special Offer: ${config.product} Exclusive for ${config.targetAudience}

Hi ${config.targetAudience},

Are you looking for the perfect ${config.product}? Look no further!

We're excited to introduce our premium ${config.product} collection designed specifically for ${config.targetAudience} like you.

✨ **What Makes Us Special:**
✓ Premium Quality
✓ Best Price Guarantee
✓ Fast Delivery
✓ 24/7 Support

**Limited Time Offer:** Get 20% off this week only!

Click here to shop now: [SHOP NOW]

Don't miss this opportunity!

Best regards,
Your Team`,

    social: `🔥 ${config.product} VIRAL! 🔥

${config.targetAudience} wajib punya!

${config.product}
✨ Best quality
✨ Affordable price
✨ Fast shipping

Tag your friends who need this! 👇

${config.keywords ? config.keywords.split(',').slice(0, 5).map(tag => `#${tag.trim()}`).join(' #') : '#viral #trending'}

#socialmedia #content #viralpost`,
  };

  const content = mockContents[config.contentType] || mockContents.caption;

  return {
    id: Date.now().toString(),
    content,
    contentType: config.contentType,
    title: config.contentType === 'blog' ? `${config.product} - Panduan Lengkap` : undefined,
    hashtags: config.contentType === 'caption' || config.contentType === 'social' ? extractHashtags(content) : undefined,
    platform: config.platforms[0],
    tone: config.tone,
    wordCount: content.split(/\s+/).length,
    timestamp: new Date(),
    config: { ...config },
  };
};

// Generate multiple content variations
export const generateContentVariations = async (
  config: ContentGenerationConfig,
  variations: number = 3
): Promise<GeneratedContent[]> => {
  const results: GeneratedContent[] = [];

  for (let i = 0; i < variations; i++) {
    try {
      // Add slight variation to the prompt for diversity
      const variedConfig = {
        ...config,
        extraInstructions: config.extraInstructions
          ? `${config.extraInstructions} (Variation ${i + 1})`
          : `Generate variation ${i + 1} with different angle or approach`,
      };

      const content = await generateContent(variedConfig);
      results.push(content);
    } catch (error) {
      console.error(`Error generating variation ${i + 1}:`, error);
      // Continue with other variations
    }
  }

  return results;
};

// Optimize content for specific platform
export const optimizeContentForPlatform = (
  content: string,
  platform: string,
  contentType: string
): string => {
  const platformConfig = PLATFORMS.find(p => p.id === platform);

  if (!platformConfig) {
    return content;
  }

  let optimizedContent = content;

  // Platform-specific optimizations
  switch (platform) {
    case 'twitter':
      // Truncate for Twitter character limit
      if (content.length > platformConfig.maxCharacters!) {
        optimizedContent = content.substring(0, platformConfig.maxCharacters! - 10) + '...';
      }
      break;

    case 'instagram':
      // Ensure Instagram formatting
      if (!optimizedContent.includes('#')) {
        optimizedContent += '\n\n#instagram #content';
      }
      break;

    case 'tiktok':
      // Add TikTok formatting
      optimizedContent = `🎵 ${optimizedContent}\n\n#tiktok #viral #fyp`;
      break;

    case 'linkedin':
      // Professional formatting for LinkedIn
      if (!optimizedContent.includes('\n\n')) {
        optimizedContent = optimizedContent.replace(/([.!?])\s/g, '$1\n\n');
      }
      break;
  }

  return optimizedContent;
};

// Analyze content quality and provide suggestions
export const analyzeContent = (content: GeneratedContent): {
  score: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
} => {
  const suggestions: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 70; // Base score

  // Check word count
  if (content.wordCount) {
    if (content.wordCount > 50) {
      strengths.push('Good content length');
      score += 10;
    } else {
      improvements.push('Content is too short');
      score -= 10;
    }
  }

  // Check hashtags
  if (content.hashtags && content.hashtags.length > 0) {
    if (content.hashtags.length >= 3 && content.hashtags.length <= 10) {
      strengths.push('Optimal hashtag count');
      score += 10;
    } else if (content.hashtags.length > 10) {
      improvements.push('Too many hashtags, consider reducing');
      score -= 5;
    }
  } else if (content.contentType === 'caption' || content.contentType === 'social') {
    improvements.push('Add relevant hashtags for better visibility');
    score -= 10;
  }

  // Check for call-to-action
  const ctaKeywords = ['pesan', 'beli', 'shop', 'klik', 'hubungi', 'order'];
  const hasCTA = ctaKeywords.some(keyword =>
    content.content.toLowerCase().includes(keyword)
  );

  if (hasCTA) {
    strengths.push('Includes call-to-action');
    score += 15;
  } else {
    improvements.push('Add a clear call-to-action');
    score -= 15;
  }

  // Check for emoji usage
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
  const emojis = content.content.match(emojiRegex);

  if (emojis && emojis.length > 0) {
    if (emojis.length <= 5) {
      strengths.push('Appropriate emoji usage');
      score += 5;
    } else {
      improvements.push('Consider reducing emoji count');
      score -= 5;
    }
  }

  // Generate suggestions based on analysis
  if (score < 70) {
    suggestions.push('Consider revising content for better engagement');
  }
  if (improvements.length > 0) {
    suggestions.push(...improvements);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    suggestions,
    strengths,
    improvements,
  };
};

// Save content to localStorage
export const saveContentToHistory = (content: GeneratedContent): void => {
  // Client-side only
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingHistory = JSON.parse(
        localStorage.getItem('contentHistory') || '[]'
      );
      existingHistory.unshift(content); // Add to beginning
      localStorage.setItem('contentHistory', JSON.stringify(existingHistory));
    }
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

// Get content history from localStorage
export const getContentHistory = (): GeneratedContent[] => {
  // Client-side only
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem('contentHistory') || '[]');
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
  return [];
};

// Delete content from history
export const deleteContentFromHistory = (contentId: string): void => {
  // Client-side only
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingHistory = JSON.parse(
        localStorage.getItem('contentHistory') || '[]'
      );
      const filteredHistory = existingHistory.filter(
        (content: GeneratedContent) => content.id !== contentId
      );
      localStorage.setItem('contentHistory', JSON.stringify(filteredHistory));
    }
  } catch (error) {
    console.error('Error deleting from history:', error);
  }
};