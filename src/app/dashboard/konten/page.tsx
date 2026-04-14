'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Copy, Heart, RotateCw, Trash2, Edit, Save, TrendingUp, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import type { ContentGenerationConfig, GeneratedContent } from '@/types/content'
import {
  generateContent,
  generateContentVariations,
  analyzeContent,
  saveContentToHistory,
  getContentHistory,
  deleteContentFromHistory,
  optimizeContentForPlatform,
} from '@/services/contentService'
import { PLATFORMS, TONES, TARGET_AUDIENCES, TEMPLATE_SUGGESTIONS } from '@/constants/contentTemplates'
import { toast } from 'sonner'

export default function KontenPage() {
  const [selectedType, setSelectedType] = useState('caption')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [generatedVariations, setGeneratedVariations] = useState<GeneratedContent[]>([])
  const [contentHistory, setContentHistory] = useState<GeneratedContent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ContentGenerationConfig>({
    contentType: 'caption',
    product: '',
    targetAudience: '',
    tone: 'casual',
    platforms: ['instagram'],
    keywords: '',
    extraInstructions: '',
  })

  // Load content history on mount
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const history = getContentHistory()
      setContentHistory(history)
    }
  }, [])

  // Update form when content type changes
  const handleContentTypeChange = (type: string) => {
    setSelectedType(type)
    setFormData(prev => ({
      ...prev,
      contentType: type as any,
    }))
    setGeneratedContent(null)
    setGeneratedVariations([])
    setAnalysis(null)
  }

  // Handle form field changes
  const handleFormChange = (field: keyof ContentGenerationConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle platform selection
  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  // Generate content
  const handleGenerate = async () => {
    if (!formData.product.trim()) {
      setError('Silakan isi deskripsi produk/jasa terlebih dahulu')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedContent(null)
    setGeneratedVariations([])

    try {
      console.log('Generating content with config:', formData)
      const content = await generateContent(formData)

      // Optimize for primary platform
      if (formData.platforms.length > 0) {
        content.content = optimizeContentForPlatform(
          content.content,
          formData.platforms[0],
          formData.contentType
        )
      }

      setGeneratedContent(content)

      // Analyze content quality
      const contentAnalysis = analyzeContent(content)
      setAnalysis(contentAnalysis)

      // Generate variations for social media content
      if (formData.contentType === 'social' && formData.platforms.includes('instagram')) {
        try {
          const variations = await generateContentVariations(formData, 2)
          setGeneratedVariations(variations.slice(0, 2))
        } catch (error) {
          console.warn('Failed to generate variations:', error)
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menggenerate konten'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Content generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy content to clipboard
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Save content to history
  const handleSave = async () => {
    if (!generatedContent) return

    setIsSaving(true)
    try {
      saveContentToHistory(generatedContent)
      const updatedHistory = getContentHistory()
      setContentHistory(updatedHistory)
      // You could add a success toast here
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete content from history
  const handleDelete = (contentId: string) => {
    deleteContentFromHistory(contentId)
    const updatedHistory = getContentHistory()
    setContentHistory(updatedHistory)
  }

  // Regenerate content
  const handleRegenerate = async () => {
    if (!formData.product.trim()) {
      setError('Silakan isi deskripsi produk/jasa terlebih dahulu')
      return
    }

    // Add variation instruction for regeneration
    const variedConfig = {
      ...formData,
      extraInstructions: formData.extraInstructions
        ? `${formData.extraInstructions} (Create a different variation with new angle)`
        : 'Create a variation with a different approach or angle',
    }

    setIsGenerating(true)
    setError(null)

    try {
      const content = await generateContent(variedConfig)

      if (formData.platforms.length > 0) {
        content.content = optimizeContentForPlatform(
          content.content,
          formData.platforms[0],
          formData.contentType
        )
      }

      setGeneratedContent(content)
      const contentAnalysis = analyzeContent(content)
      setAnalysis(contentAnalysis)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal meregenerate konten'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Konten</h1>
        <p className="text-gray-600">Buat konten marketing yang menarik dengan AI dalam hitungan detik</p>
      </div>

      {/* Content Type Selection */}
      <div className="mb-8">
        <Card className="ring-2 ring-blue-500 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-lg font-semibold">Caption Instagram</div>
            <div className="text-sm text-gray-600 mt-1">Generate Instagram captions yang engaging dan profesional</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle>Detail Konten</CardTitle>
            <CardDescription>
              Berikan informasi tentang produk/jasa yang ingin Anda promosikan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Produk/Jasa *
              </Label>
              <Textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                rows={3}
                placeholder="Contoh: Gamis katun premium warna pastel untuk wanita muslimah"
                value={formData.product}
                onChange={(e) => handleFormChange('product', e.target.value)}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </Label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                value={formData.targetAudience}
                onChange={(e) => handleFormChange('targetAudience', e.target.value)}
              >
                {TARGET_AUDIENCES.map((audience) => (
                  <option key={audience.id} value={audience.name}>
                    {audience.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </Label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                value={formData.tone}
                onChange={(e) => handleFormChange('tone', e.target.value)}
              >
                {TONES.map((tone) => (
                  <option key={tone.id} value={tone.name}>
                    {tone.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <label key={platform.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={formData.platforms.includes(platform.name)}
                      onChange={() => handlePlatformToggle(platform.name)}
                    />
                    <span className="text-sm flex items-center gap-1">
                      {platform.icon} {platform.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (Optional)
              </Label>
              <Input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="gamis, katun, modest fashion, muslimah"
                value={formData.keywords}
                onChange={(e) => handleFormChange('keywords', e.target.value)}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  🚀 Generate Konten
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Preview */}
        <Card className="border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle>Hasil Generate</CardTitle>
            <CardDescription>
              {isGenerating ? 'Sedang menggenerate konten...' : generatedContent ? 'Konten berhasil digenerate' : 'Konten AI-generated akan muncul di sini'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin text-4xl mb-4">🚀</div>
                <p className="text-gray-600">Sedang menggenerate konten AI...</p>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                {/* Main Generated Content */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-blue-900 capitalize">
                      {generatedContent.contentType}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {generatedContent.platform}
                    </Badge>
                  </div>

                  {/* Content Analysis */}
                  {analysis && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Quality Score</span>
                        <span className={`text-sm font-bold ${
                          analysis.score >= 80 ? 'text-green-600' :
                          analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysis.score}/100
                        </span>
                      </div>
                      {analysis.strengths.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-green-700">✅ Strengths:</span>
                          <div className="text-xs text-gray-600">
                            {analysis.strengths.join(', ')}
                          </div>
                        </div>
                      )}
                      {analysis.improvements.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-yellow-700">💡 Improvements:</span>
                          <div className="text-xs text-gray-600">
                            {analysis.improvements.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-blue-800 whitespace-pre-wrap">{generatedContent.content}</div>

                  {/* Content Stats */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-blue-600">
                    {generatedContent.wordCount && (
                      <span>Words: {generatedContent.wordCount}</span>
                    )}
                    {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                      <span>Hashtags: {generatedContent.hashtags.length}</span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopy(generatedContent.content)}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RotateCw className="w-3 h-3 mr-1 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3 mr-1" /> Save
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRegenerate}>
                      <RotateCw className="w-3 h-3 mr-1" /> Regenerate
                    </Button>
                  </div>
                </div>

                {/* Variations */}
                {generatedVariations.length > 0 && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">🔄 Variations</h3>
                    <div className="space-y-3">
                      {generatedVariations.map((variation, index) => (
                        <div key={variation.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Variation {index + 1}</span>
                            <Button size="sm" variant="ghost" onClick={() => handleCopy(variation.content)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">{variation.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template Suggestions */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">💡 Template Suggestions</h3>
                  <div className="space-y-2">
                    {TEMPLATE_SUGGESTIONS.slice(0, 3).map((template) => (
                      <div key={template.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="text-sm font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-center">
                  Isi form di samping dan klik generate untuk membuat konten AI-powered
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      </div>
  )
}