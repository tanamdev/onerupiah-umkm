'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { GenerationConfig, GeneratedImage } from '@/types/image';
import { generateImage } from '@/services/imageService';
import {
  PRODUCT_STYLES,
  BACKGROUND_STYLES,
  PRODUCT_TYPES,
  PLATING_STYLES,
  IMAGE_SIZES,
  IMAGE_SIZE_CATEGORIES,
} from '@/constants/prompts';
import { getFoodSuggestions, FOOD_CATEGORIES } from '@/constants/foodNames';

export default function GambarPage() {
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [savedImages, setSavedImages] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [foodSuggestions, setFoodSuggestions] = useState<string[]>([]);
  const [showFoodSuggestions, setShowFoodSuggestions] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({
    platingStyle: PRODUCT_STYLES[0],
    backgroundStyle: BACKGROUND_STYLES[0],
    extraInstructions: '',
    imageSize: IMAGE_SIZES[0], // Default ke Instagram Post
    foodName: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved images from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('generatedImages') || '[]');
      setSavedImages(saved);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsPreviewOpen(false);
          setImageScale(1);
          break;
        case '+':
        case '=':
          setImageScale((prev) => Math.min(prev * 1.2, 3));
          break;
        case '-':
        case '_':
          setImageScale((prev) => Math.max(prev * 0.8, 0.5));
          break;
        case '0':
          setImageScale(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen]);

  // Reset zoom when opening new image
  useEffect(() => {
    if (isPreviewOpen && previewImage) {
      setImageScale(1);
    }
  }, [isPreviewOpen, previewImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('File tidak valid. Gunakan JPG, PNG, atau WebP.');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File terlalu besar. Max size adalah 10MB.');
        return;
      }

      setUploadedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = () => {
    setUploadedFile(null);
    setUploadedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setImageScale(1); // Reset zoom saat buka modal
    setIsPreviewOpen(true);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(0.5, imageScale * delta), 3);
    setImageScale(newScale);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('File tidak valid. Gunakan JPG, PNG, atau WebP.');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File terlalu besar. Max size adalah 10MB.');
        return;
      }

      setUploadedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setError(
        'Silakan upload gambar terlebih dahulu atau setup API key Gemini'
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Log untuk debugging
      console.log('Config for generation:', {
        platingStyle: config.platingStyle,
        extraInstructions: config.extraInstructions,
        imageSize: config.imageSize?.name,
        foodName: config.foodName,
      });

      const images = await generateImage(uploadedFile, config);
      setGeneratedImages(images);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menggenerate gambar';
      setError(errorMessage);
      console.error('Generate error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const saveToHistory = async () => {
    // Save to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const existingImages = JSON.parse(
        localStorage.getItem('generatedImages') || '[]'
      );
      const newImages = generatedImages.map((img) => ({
        ...img,
        timestamp: new Date().toISOString(),
      }));
      const updatedImages = [...existingImages, ...newImages];
      localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
      setSavedImages(updatedImages);
      alert('Gambar berhasil disimpan ke histori!');
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Generate Gambar
        </h1>
        <p className='text-gray-600'>
          Buat gambar produk dan konten visual yang menarik dengan AI
        </p>
      </div>

      {/* Style Selection */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {[
          { style: 'realistic', label: 'Realistic', icon: '📸' },
          { style: 'cartoon', label: 'Cartoon', icon: '🎨' },
          { style: 'minimalist', label: 'Minimalist', icon: '◻️' },
          { style: 'vintage', label: 'Vintage', icon: '📷' },
        ].map((item) => (
          <Card
            key={item.style}
            className={`cursor-pointer transition-all ${
              selectedStyle === item.style
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedStyle(item.style)}
          >
            <CardContent className='p-4 text-center'>
              <div className='text-3xl mb-2'>{item.icon}</div>
              <div className='text-sm font-medium'>{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Gambar</CardTitle>
            <CardDescription>
              Upload gambar dan konfigurasi style yang diinginkan
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* File Upload */}
            <div>
              <Label
                htmlFor='image-upload'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Upload Gambar Produk
              </Label>
              <input
                ref={fileInputRef}
                id='image-upload'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />

              {/* Preview Area */}
              {uploadedImagePreview ? (
                <div className='space-y-3'>
                  <div className='relative group'>
                    <div
                      onClick={() => openImagePreview(uploadedImagePreview)}
                      className='cursor-pointer'
                    >
                      <img
                        src={uploadedImagePreview}
                        alt='Preview gambar yang diupload'
                        className='w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors'
                      />
                      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100'>
                        <div className='bg-white rounded-full p-2 shadow-lg'>
                          <svg
                            className='w-6 h-6 text-purple-600'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => openImagePreview(uploadedImagePreview)}
                        className='bg-white hover:bg-gray-100'
                      >
                        🔍
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={clearUploadedImage}
                        className='bg-red-500 hover:bg-red-600'
                      >
                        ❌
                      </Button>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-green-600'>
                      ✅ {uploadedFile?.name}
                      <div className='text-xs text-gray-500'>
                        {(uploadedFile?.size
                          ? (uploadedFile.size / 1024 / 1024).toFixed(2)
                          : '0') + ' MB'}{' '}
                        • {uploadedFile?.type}
                      </div>
                      <div className='text-xs text-blue-600 mt-1'>
                        💡 Klik gambar untuk preview ukuran penuh
                      </div>
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={clearUploadedImage}
                    >
                      Ganti Gambar
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className='text-4xl mb-2'>
                    {isDragging ? '📥' : '📁'}
                  </div>
                  <p className='text-gray-600 mb-1'>
                    {isDragging
                      ? 'Drop file di sini...'
                      : 'Klik untuk upload gambar'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Atau drag and drop file di sini
                  </p>
                  <p className='text-xs text-gray-400 mt-2'>
                    Support: JPG, PNG, WebP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Food Name */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Nama Makanan
              </Label>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Contoh: Soto Ayam, Nasi Goreng, Rendang'
                  value={config.foodName || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfig({ ...config, foodName: value });

                    // Get suggestions when typing
                    if (value.length >= 2) {
                      const suggestions = getFoodSuggestions(value);
                      setFoodSuggestions(suggestions);
                      setShowFoodSuggestions(suggestions.length > 0);
                    } else {
                      setFoodSuggestions([]);
                      setShowFoodSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (config.foodName && config.foodName.length >= 2) {
                      const suggestions = getFoodSuggestions(config.foodName);
                      setFoodSuggestions(suggestions);
                      setShowFoodSuggestions(suggestions.length > 0);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow clicking on suggestions
                    setTimeout(() => setShowFoodSuggestions(false), 200);
                  }}
                  className='w-full'
                />

                {/* Suggestions Dropdown */}
                {showFoodSuggestions && foodSuggestions.length > 0 && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
                    {foodSuggestions.map((food, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setConfig({ ...config, foodName: food });
                          setFoodSuggestions([]);
                          setShowFoodSuggestions(false);
                        }}
                        className='px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                      >
                        <div className='text-sm font-medium text-gray-900'>
                          {food}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='mt-3'>
                <p className='text-xs text-gray-500'>
                  💡 Nama spesifik makanan untuk hasil yang lebih akurat
                </p>

                {/* Popular Categories */}
                <div className='mt-3 space-y-2'>
                  <p className='text-xs font-medium text-gray-600'>Populer:</p>
                  <div className='flex flex-wrap gap-1'>
                    {[
                      'Nasi Goreng',
                      'Soto Ayam',
                      'Rendang',
                      'Bakso',
                      'Ayam Bakar',
                    ].map((food) => (
                      <button
                        key={food}
                        onClick={() => {
                          setConfig({ ...config, foodName: food });
                          setFoodSuggestions([]);
                          setShowFoodSuggestions(false);
                        }}
                        className='text-xs bg-gray-100 hover:bg-purple-100 px-2 py-1 rounded transition-colors'
                      >
                        {food}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Size Selection */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Ukuran & Format
              </Label>
              <div className='space-y-3'>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  value={config.imageSize?.id || ''}
                  onChange={(e) => {
                    const selectedSize = IMAGE_SIZES.find(
                      (size) => size.id === e.target.value
                    );
                    if (selectedSize) {
                      setConfig({ ...config, imageSize: selectedSize });
                    }
                  }}
                >
                  <option value=''>Pilih ukuran gambar</option>
                  {IMAGE_SIZES.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name} ({size.dimensions}) - {size.ratio}
                    </option>
                  ))}
                </select>

                {/* Size Preview */}
                {config.imageSize && (
                  <div className='bg-purple-50 border border-purple-200 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium text-purple-900'>
                          {config.imageSize.name}
                        </div>
                        <div className='text-sm text-purple-700'>
                          {config.imageSize.dimensions} • Ratio{' '}
                          {config.imageSize.ratio}
                        </div>
                        <div className='text-xs text-purple-600 mt-1'>
                          💡 {config.imageSize.description}
                        </div>
                      </div>
                      <div className='text-2xl'>
                        {config.imageSize.category === 'Social Media' && '📱'}
                        {config.imageSize.category === 'E-commerce' && '🛒'}
                        {config.imageSize.category === 'Video' && '🎬'}
                        {config.imageSize.category === 'Web' && '🌐'}
                        {config.imageSize.category === 'Print' && '🖨️'}
                        {config.imageSize.category === 'Branding' && '🏷️'}
                        {config.imageSize.category === 'Messaging' && '💬'}
                      </div>
                    </div>

                    {/* Visual Ratio Preview */}
                    <div className='mt-3 flex justify-center'>
                      <div className='relative'>
                        <div
                          className='bg-gradient-to-br from-purple-200 to-blue-200 rounded border-2 border-purple-300'
                          style={{
                            width: '60px',
                            height: `${
                              60 /
                              (config.imageSize!.width /
                                config.imageSize!.height)
                            }px`,
                            minHeight: '20px',
                            maxHeight: '80px',
                          }}
                        >
                          <div className='w-full h-full flex items-center justify-center text-xs text-purple-700 font-medium'>
                            {config.imageSize.ratio}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Style */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Gaya Produk
              </Label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                value={config.platingStyle}
                onChange={(e) =>
                  setConfig({ ...config, platingStyle: e.target.value })
                }
              >
                {PRODUCT_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Background Style */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Latar Belakang
              </Label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                value={config.backgroundStyle}
                onChange={(e) =>
                  setConfig({ ...config, backgroundStyle: e.target.value })
                }
              >
                {BACKGROUND_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Extra Instructions */}
            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Instruksi Tambahan
              </Label>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                rows={3}
                placeholder='Contoh: Fokus pada tekstur, lighting dramatis, warna-warna cerah...'
                value={config.extraInstructions}
                onChange={(e) =>
                  setConfig({ ...config, extraInstructions: e.target.value })
                }
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              className='w-full bg-gradient-to-r from-purple-600 to-purple-800'
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  Generating...
                </>
              ) : (
                <>🎨 Generate Gambar</>
              )}
            </Button>

            {/* API Key Info */}
            {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
              <Alert>
                <AlertDescription>
                  ℹ️ Untuk hasil terbaik, tambahkan NEXT_PUBLIC_GEMINI_API_KEY
                  di .env.local
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Output Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil Generate</CardTitle>
            <CardDescription>
              {isGenerating
                ? 'Sedang menggenerate gambar...'
                : generatedImages.length > 0
                ? `${generatedImages.length} gambar berhasil digenerate`
                : 'Gambar AI-generated akan muncul di sini'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='animate-spin text-4xl mb-4'>⏳</div>
                <p className='text-gray-600'>Sedang menggenerate gambar...</p>
              </div>
            ) : generatedImages.length > 0 ? (
              <>
                {/* Generated Images */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
                  {generatedImages.map((image, index) => (
                    <div key={index} className='relative group'>
                      <div className='relative'>
                        <img
                          src={image.imageUrl}
                          alt={`Generated Image ${index + 1}`}
                          className='w-full aspect-square object-cover rounded-lg cursor-pointer hover:border-purple-300 transition-colors border-2 border-transparent'
                          onClick={() => openImagePreview(image.imageUrl)}
                        />
                        {/* Image Size Badge */}
                        {image.imageSize && (
                          <div className='absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs'>
                            {image.imageSize.dimensions}
                          </div>
                        )}
                        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100'>
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              className='bg-white text-gray-900 hover:bg-gray-100'
                              onClick={(e) => {
                                e.stopPropagation();
                                openImagePreview(image.imageUrl);
                              }}
                            >
                              🔍
                            </Button>
                            <Button
                              size='sm'
                              className='bg-white text-gray-900 hover:bg-gray-100'
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(image.imageUrl, index);
                              }}
                            >
                              ⬇️
                            </Button>
                          </div>
                        </div>
                      </div>
                      {/* Image Info */}
                      <div className='mt-2 p-2 bg-gray-50 rounded text-xs'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-gray-700'>
                            {image.imageSize?.name || 'Custom Size'}
                          </span>
                          <span className='text-gray-500'>
                            {image.imageSize?.ratio || 'Custom Ratio'}
                          </span>
                        </div>
                        <div className='text-gray-600 mt-1'>
                          {image.imageSize?.description || 'Custom image size'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-2 justify-center'>
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={() =>
                      generatedImages.forEach((img, idx) =>
                        downloadImage(img.imageUrl, idx)
                      )
                    }
                  >
                    📥 Download All
                  </Button>
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={handleGenerate}
                  >
                    🔄 Regenerate
                  </Button>
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={saveToHistory}
                  >
                    ❤️ Save
                  </Button>
                </div>

                {/* Style Variations */}
                <div className='mt-6'>
                  <h3 className='font-medium text-gray-900 mb-3'>
                    Quick Styles
                  </h3>
                  <div className='grid grid-cols-3 gap-2'>
                    {PRODUCT_STYLES.slice(0, 6).map((style) => (
                      <Button
                        key={style}
                        size='sm'
                        variant='outline'
                        className='text-xs'
                        onClick={() =>
                          setConfig({ ...config, platingStyle: style })
                        }
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='text-6xl mb-4'>🎨</div>
                <p className='text-gray-600 text-center'>
                  Upload gambar dan konfigurasi style untuk mulai generate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Generations */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Gambar Terbaru</CardTitle>
          <CardDescription>Histori gambar yang Anda generate</CardDescription>
        </CardHeader>
        <CardContent>
          {isClient && savedImages.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {savedImages
                .slice(-8)
                .reverse()
                .map((image: any, index: number) => (
                  <div key={index} className='relative group'>
                    <img
                      src={image.imageUrl}
                      alt={`Historical Image ${index + 1}`}
                      className='w-full aspect-square object-cover rounded-lg cursor-pointer hover:border-purple-300 transition-colors border-2 border-transparent'
                      onClick={() => openImagePreview(image.imageUrl)}
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100'>
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          className='bg-white text-gray-900 hover:bg-gray-100 p-2'
                          onClick={(e) => {
                            e.stopPropagation();
                            openImagePreview(image.imageUrl);
                          }}
                        >
                          🔍
                        </Button>
                        <Button
                          size='sm'
                          className='bg-white text-gray-900 hover:bg-gray-100 p-2'
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(image.imageUrl, index);
                          }}
                        >
                          📥
                        </Button>
                      </div>
                    </div>
                    <div className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                      {new Date(image.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-4xl mb-4'>📂</div>
              <p className='text-gray-600'>
                {isClient ? 'Belum ada gambar yang tersimpan' : 'Loading...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips & Tricks */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Tips & Tricks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-blue-50 rounded-lg'>
              <h4 className='font-medium text-blue-900 mb-2'>
                💡 Deskripsi Detail
              </h4>
              <p className='text-sm text-blue-700'>
                Semakin detail deskripsi Anda, semakin baik hasil gambar yang
                dihasilkan.
              </p>
            </div>
            <div className='p-4 bg-purple-50 rounded-lg'>
              <h4 className='font-medium text-purple-900 mb-2'>
                🎨 Konsistensi Style
              </h4>
              <p className='text-sm text-purple-700'>
                Gunakan style yang sama untuk produk serupa agar branding
                konsisten.
              </p>
            </div>
            <div className='p-4 bg-green-50 rounded-lg'>
              <h4 className='font-medium text-green-900 mb-2'>
                🔄 Generate Berulang
              </h4>
              <p className='text-sm text-green-700'>
                Jangan ragu untuk regenerate beberapa kali dapatkan hasil
                terbaik.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='max-w-7xl w-full h-[90vh] max-h-[90vh] p-0 overflow-hidden bg-black'>
          <div className='relative h-full flex flex-col'>
            {/* Header */}
            <div className='absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4'>
              <div className='flex items-center justify-between'>
                <div className='text-white'>
                  <DialogTitle className='text-lg font-semibold'>
                    Preview Gambar
                  </DialogTitle>
                  <DialogDescription className='text-gray-300 text-sm'>
                    Scroll: Zoom • ESC: Keluar • +/-: Zoom • 0: Reset
                  </DialogDescription>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/30'>
                    🔍 {Math.round(imageScale * 100)}%
                  </span>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setImageScale(1)}
                    className='bg-white/10 hover:bg-white/20 text-white border-white/30'
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div
              className='flex-1 flex items-center justify-center p-8 relative overflow-hidden'
              onWheel={handleWheel}
            >
              <div className='w-full h-full flex items-center justify-center'>
                {previewImage && (
                  <div className='relative max-w-full max-h-full'>
                    {/* Image Container */}
                    <div className='relative inline-block'>
                      <img
                        src={previewImage}
                        alt='Full size preview'
                        className='max-w-full max-h-[calc(90vh-140px)] object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-out'
                        style={{
                          transform: `scale(${imageScale})`,
                          transformOrigin: 'center',
                          filter:
                            imageScale > 1
                              ? 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))'
                              : 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))',
                        }}
                        draggable={false}
                      />

                      {/* Zoom Hints */}
                      {imageScale === 1 && (
                        <div className='absolute -bottom-12 left-0 right-0 text-center'>
                          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20'>
                            <span>🖱️</span>
                            <span>Scroll untuk zoom in/out</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Info */}
                    <div className='absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20'>
                      <div className='text-xs space-y-1'>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold'>Ukuran Asli:</span>
                          <span>Full Resolution</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold'>Zoom:</span>
                          <span>{Math.round(imageScale * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Gradient */}
            <div className='absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent h-20'></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
