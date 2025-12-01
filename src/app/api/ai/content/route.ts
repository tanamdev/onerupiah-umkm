import { NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import type {
  ContentGenerationConfig,
  GeneratedContent,
} from '@/types/content'
import { CONTENT_TEMPLATES } from '@/constants/contentTemplates'

const API_KEY = process.env.GEMINI_API_KEY
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null

const DEFAULT_TEXT_MODEL = 'gemini-3-pro-preview'
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_MAX_TOKENS = 2048

const buildContentPrompt = (config: ContentGenerationConfig): string => {
  const template = CONTENT_TEMPLATES[config.contentType]

  if (!template) {
    throw new Error(`Template not found for content type: ${config.contentType}`)
  }

  let prompt = template.prompt
  prompt = prompt.replace(/{{product}}/g, config.product)
  prompt = prompt.replace(/{{targetAudience}}/g, config.targetAudience)
  prompt = prompt.replace(/{{tone}}/g, config.tone)
  prompt = prompt.replace(
    /{{keywords}}/g,
    config.keywords || 'Tidak ada keywords spesifik'
  )
  prompt = prompt.replace(/{{platform}}/g, config.platforms.join(', '))
  prompt = prompt.replace(
    /{{extraInstructions}}/g,
    config.extraInstructions || 'Tidak ada instruksi tambahan'
  )

  return prompt
}

const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g
  const matches = content.match(hashtagRegex)
  return matches || []
}

const extractTitle = (content: string): string | undefined => {
  const lines = content.split('\n')
  const titleLine = lines.find(
    (line) =>
      line.trim().length > 0 &&
      line.trim().length < 100 &&
      !line.includes('**') &&
      !line.includes('#')
  )
  return titleLine?.trim()
}

export async function POST(request: Request) {
  if (!ai) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY belum dikonfigurasi di server' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const config: ContentGenerationConfig | undefined = body?.config

    if (!config) {
      return NextResponse.json(
        { error: 'Payload config tidak ditemukan' },
        { status: 400 }
      )
    }

    const prompt = buildContentPrompt(config)

    const response = await ai.models.generateContent({
      model: DEFAULT_TEXT_MODEL,
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT],
        temperature: DEFAULT_TEMPERATURE,
        maxOutputTokens: DEFAULT_MAX_TOKENS,
      },
    })

    const generatedText = response.text?.trim()

    if (!generatedText) {
      return NextResponse.json(
        { error: 'AI tidak menghasilkan konten' },
        { status: 422 }
      )
    }

    const generatedContent: GeneratedContent = {
      id: Date.now().toString(),
      content: generatedText,
      contentType: config.contentType,
      title:
        config.contentType === 'blog'
          ? extractTitle(generatedText)
          : undefined,
      hashtags:
        config.contentType === 'caption' || config.contentType === 'social'
          ? extractHashtags(generatedText)
          : undefined,
      platform: config.platforms[0],
      tone: config.tone,
      wordCount: generatedText.split(/\s+/).length,
      timestamp: new Date(),
      config: { ...config },
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Gagal menghasilkan konten dengan Gemini' },
      { status: 500 }
    )
  }
}
