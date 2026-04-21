import { Buffer } from 'node:buffer';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';
import type { GenerationConfig } from '@/types/image';
import {
  buildRealisticFoodPrompt,
  buildPosterPrompt,
  buildProductPrompt,
  processAIResponse,
  extractAIErrorMessage,
  isPosterMode,
  isFoodMode,
  isProductMode,
} from '@/services/image';
import { checkUserQuota } from '@/lib/usageQuota';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';

const API_KEY = process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const DEFAULT_IMAGE_MODEL = 'gemini-3-pro-image-preview';
const DEFAULT_IMAGE_TEMPERATURE = 0.4;
const DEFAULT_TEXT_MODEL = 'gemini-3-pro-preview';
const DEFAULT_TEXT_TEMPERATURE = 0.3;

const toInlineData = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: file.type || 'application/octet-stream',
    },
  };
};

const buildPrompt = (config: GenerationConfig): string => {
  if (isPosterMode(config)) {
    return buildPosterPrompt(config);
  }

  if (isFoodMode(config)) {
    return buildRealisticFoodPrompt(config);
  }

  if (isProductMode(config)) {
    return buildProductPrompt(config);
  }

  return buildRealisticFoodPrompt(config);
};

const handleGenerateRequest = async (
  formData: FormData,
  imagesPerGeneration: number = 2,
) => {
  const configRaw = formData.get('config');
  const imageFile = formData.get('image');

  if (!configRaw || typeof configRaw !== 'string') {
    return NextResponse.json(
      { error: 'Config untuk image generation tidak ditemukan' },
      { status: 400 },
    );
  }

  if (!(imageFile instanceof File)) {
    return NextResponse.json(
      { error: 'File gambar diperlukan untuk menggunakan Gemini' },
      { status: 400 },
    );
  }

  const config: GenerationConfig = JSON.parse(configRaw);
  const textPrompt = buildPrompt(config);
  const imagePart = await toInlineData(imageFile);

  const generateSingleImage = async (): Promise<string> => {
    const response = await ai!.models.generateContent({
      model: DEFAULT_IMAGE_MODEL,
      contents: {
        parts: [imagePart, { text: textPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        temperature: DEFAULT_IMAGE_TEMPERATURE,
      },
    });

    try {
      return processAIResponse(response);
    } catch (processError) {
      const textResponse = response.text?.trim();
      throw new Error(extractAIErrorMessage(textResponse));
    }
  };

  const imageUrls = await Promise.all(
    Array.from({ length: imagesPerGeneration }, () => generateSingleImage()),
  );

  return NextResponse.json({
    images: imageUrls.map((url) => ({
      imageUrl: url,
      prompt: textPrompt,
      timestamp: new Date().toISOString(),
      imageSize: config.imageSize || null,
    })),
  });
};

const handleEnhanceRequest = async (formData: FormData) => {
  const currentInstructions = formData.get('instructions');

  if (typeof currentInstructions !== 'string') {
    return NextResponse.json(
      { error: 'Instruksi tidak ditemukan' },
      { status: 400 },
    );
  }

  const foodName =
    typeof formData.get('foodName') === 'string'
      ? (formData.get('foodName') as string)
      : undefined;
  const platingStyle =
    typeof formData.get('platingStyle') === 'string'
      ? (formData.get('platingStyle') as string)
      : undefined;
  const imageSizeRaw =
    typeof formData.get('imageSize') === 'string'
      ? (formData.get('imageSize') as string)
      : undefined;

  const imageSize = imageSizeRaw ? JSON.parse(imageSizeRaw) : undefined;

  const enhancePrompt = `Tingkatkan instruksi fotografi tambahan berikut menjadi lebih spesifik dan profesional:

Instruksi User:
"${currentInstructions}"

${foodName ? `dY", Target Produk: ${foodName}` : ''}
${platingStyle ? `dYZ" Gaya: ${platingStyle}` : ''}
${
  imageSize
    ? `dY"? Format Output: ${imageSize.name} (${imageSize.dimensions})`
    : ''
}

Tugas:
- Jangan ubah instruksi utama template (sistem sudah handle bagian utama)
- Fokus hanya memperbaiki & menambah detail pada instruksi tambahan user
- Tambahkan teknik fotografi spesifik jika relevan
- Berikan tips visual yang actionable
- Pertahankan intent user asli
- Max 2-3 kalimat tambahan

Contoh output format:
"${currentInstructions}" + [tambahan profesional singkat]

Hasilkan instruksi tambahan yang lebih baik dan detail.`;

  const response = await ai!.models.generateContent({
    model: DEFAULT_TEXT_MODEL,
    contents: enhancePrompt,
    config: {
      responseModalities: [Modality.TEXT],
      temperature: DEFAULT_TEXT_TEMPERATURE,
    },
  });

  const enhanced = response.text?.trim() || currentInstructions;
  return NextResponse.json({ enhancedInstructions: enhanced });
};

export async function POST(request: NextRequest) {
  if (!ai) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY belum dikonfigurasi di server' },
      { status: 503 },
    );
  }

  // --- Pengecekan autentikasi & kuota ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Silakan login terlebih dahulu untuk menggunakan fitur ini.' },
      { status: 401 },
    );
  }

  const quota = await checkUserQuota(session.user.id);

  if (!quota.canGenerateImage) {
    const limitMsg =
      quota.imageLimit !== null
        ? `Kuota generate gambar Anda sudah habis (${quota.imageUsed}/${quota.imageLimit}).`
        : 'Kuota generate gambar Anda sudah habis.';

    const resetMsg = quota.nextResetAt
      ? ` Kuota akan direset pada ${quota.nextResetAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`
      : ' Silakan upgrade paket Anda untuk mendapatkan lebih banyak kuota.';

    return NextResponse.json(
      {
        error: limitMsg + resetMsg,
        code: 'QUOTA_EXCEEDED',
        quota: {
          imageUsed: quota.imageUsed,
          imageLimit: quota.imageLimit,
          nextResetAt: quota.nextResetAt,
        },
      },
      { status: 403 },
    );
  }
  // --- Akhir pengecekan kuota ---

  try {
    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'enhance') {
      return await handleEnhanceRequest(formData);
    }

    if (action === 'generate') {
      const numImagesToGenerate =
        quota.package?.imagesPerGeneration ??
        (quota.plan === 'FREE' || quota.plan === 'TRIAL' ? 1 : 2);
      const result = await handleGenerateRequest(formData, numImagesToGenerate);

      // Catat penggunaan image ke database jika berhasil (1 klik = 1 kuota)
      if (result.ok) {
        await prisma.imageGeneration.create({
          data: {
            userId: session.user.id,
            prompt: formData.get('action')?.toString() || 'generate',
            status: 'COMPLETED',
          },
        });
      }

      return result;
    }

    return NextResponse.json(
      { error: 'Action tidak dikenal untuk endpoint AI image' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Image generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal memproses permintaan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
