import express, { Request, Response } from 'express';
import { TranslationService } from '../services/TranslationService';

const router = express.Router();
const translationService = new TranslationService();

// 支持的语言
const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US', 'th-TH', 'ms-MY', 'vi-VN', 'ja-JP', 'ko-KR'];

/**
 * @route GET /api/v1/i18n/locales
 * @desc 获取支持的语言列表
 */
router.get('/locales', (req: Request, res: Response) => {
  res.json({
    data: SUPPORTED_LOCALES.map(code => ({
      code,
      name: getLocaleName(code),
      nativeName: getNativeName(code)
    }))
  });
});

/**
 * @route GET /api/v1/i18n/translations/:locale
 * @desc 获取指定语言的翻译
 */
router.get('/translations/:locale', async (req: Request, res: Response) => {
  const { locale } = req.params;
  const { namespace } = req.query;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return res.status(400).json({ error: 'Unsupported locale' });
  }

  try {
    const translations = await translationService.getTranslations(
      locale,
      namespace as string
    );
    res.json({ data: translations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/v1/i18n/translate
 * @desc 翻译文本
 */
router.get('/translate', async (req: Request, res: Response) => {
  const { key, locale, params } = req.query;

  if (!key || !locale) {
    return res.status(400).json({ error: 'Key and locale are required' });
  }

  try {
    const translation = await translationService.translate(
      key as string,
      locale as string,
      params ? JSON.parse(params as string) : {}
    );
    res.json({ data: { key, locale, translation } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/v1/i18n/detect
 * @desc 检测用户语言
 */
router.get('/detect', (req: Request, res: Response) => {
  const acceptLanguage = req.headers['accept-language'] || 'en-US';
  const detectedLocale = translationService.detectLocale(acceptLanguage);
  
  res.json({
    data: {
      detected: detectedLocale,
      supported: SUPPORTED_LOCALES.includes(detectedLocale),
      fallback: SUPPORTED_LOCALES.includes(detectedLocale) ? detectedLocale : 'en-US'
    }
  });
});

function getLocaleName(code: string): string {
  const names: Record<string, string> = {
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'en-US': 'English',
    'th-TH': 'Thai',
    'ms-MY': 'Malay',
    'vi-VN': 'Vietnamese',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean'
  };
  return names[code] || code;
}

function getNativeName(code: string): string {
  const names: Record<string, string> = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'th-TH': 'ภาษาไทย',
    'ms-MY': 'Bahasa Melayu',
    'vi-VN': 'Tiếng Việt',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
  };
  return names[code] || code;
}

export default router;

